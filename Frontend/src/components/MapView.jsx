import { useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import './MapView.css'

const sourceIcon = new L.DivIcon({
  className: 'custom-marker source-marker',
  html: '<div class="marker-pin source"><span>A</span></div>',
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42],
})

const destIcon = new L.DivIcon({
  className: 'custom-marker dest-marker',
  html: '<div class="marker-pin dest"><span>B</span></div>',
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42],
})

function createPlaneIcon(rotation) {
  return new L.DivIcon({
    className: 'plane-marker',
    html: `<div class="plane-icon" style="transform: rotate(${rotation}deg)">✈️</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function FitBounds({ source, destination }) {
  const map = useMap()

  useEffect(() => {
    if (source && destination) {
      const bounds = L.latLngBounds([source, destination])
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 })
    } else if (source) {
      map.flyTo(source, 6, { duration: 1.5 })
    } else if (destination) {
      map.flyTo(destination, 6, { duration: 1.5 })
    }
  }, [map, source, destination])

  return null
}

function AnimatedPlane({ path }) {
  const map = useMap()
  const markerRef = useRef(null)
  const animFrameRef = useRef(null)
  const indexRef = useRef(0)

  const getBearing = useCallback((start, end) => {
    const startLat = start[0] * Math.PI / 180
    const startLng = start[1] * Math.PI / 180
    const endLat = end[0] * Math.PI / 180
    const endLng = end[1] * Math.PI / 180
    const dLng = endLng - startLng
    const x = Math.sin(dLng) * Math.cos(endLat)
    const y = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng)
    return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360
  }, [])

  useEffect(() => {
    if (!path || path.length < 2) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
      return
    }

    indexRef.current = 0
    const bearing = getBearing(path[0], path[1])
    const icon = createPlaneIcon(bearing - 45)

    if (markerRef.current) {
      markerRef.current.setLatLng(path[0])
      markerRef.current.setIcon(icon)
    } else {
      markerRef.current = L.marker(path[0], { icon, zIndexOffset: 1000 }).addTo(map)
    }

    let lastTime = 0
    const speed = 60

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp
      const delta = timestamp - lastTime

      if (delta > speed) {
        lastTime = timestamp
        indexRef.current += 1

        if (indexRef.current >= path.length) {
          indexRef.current = 0
        }

        const current = path[indexRef.current]
        const next = path[Math.min(indexRef.current + 1, path.length - 1)]
        const bearing = getBearing(current, next)

        if (markerRef.current) {
          markerRef.current.setLatLng(current)
          markerRef.current.setIcon(createPlaneIcon(bearing - 45))
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [path, map, getBearing])

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [map])

  return null
}

function generateCurvedPath(start, end) {
  if (!start || !end) return []

  const points = []
  const latlng1 = L.latLng(start)
  const latlng2 = L.latLng(end)

  const offsetX = (latlng2.lng - latlng1.lng) / 3
  const midLat = (latlng1.lat + latlng2.lat) / 2 + Math.abs(offsetX) * 0.3
  const midLng = (latlng1.lng + latlng2.lng) / 2

  const numPoints = 100
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const lat = (1 - t) * (1 - t) * latlng1.lat + 2 * (1 - t) * t * midLat + t * t * latlng2.lat
    const lng = (1 - t) * (1 - t) * latlng1.lng + 2 * (1 - t) * t * midLng + t * t * latlng2.lng
    points.push([lat, lng])
  }

  return points
}

function MapView({ source, destination, sourceLabel, destLabel }) {
  const defaultCenter = [20, 0]
  const curvedPath = generateCurvedPath(source, destination)

  return (
    <div className="map-view">
      <MapContainer
        center={source || defaultCenter}
        zoom={3}
        className="leaflet-map"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {source && (
          <Marker position={source} icon={sourceIcon}>
            <Popup>
              <div className="map-popup">
                <strong>📍 Origin</strong>
                <p>{sourceLabel || 'Source'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination} icon={destIcon}>
            <Popup>
              <div className="map-popup">
                <strong>🎯 Destination</strong>
                <p>{destLabel || 'Destination'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {curvedPath.length > 0 && (
          <>
            <Polyline
              positions={curvedPath}
              pathOptions={{
                color: '#4f46e5',
                weight: 3,
                opacity: 0.6,
                dashArray: '8, 8',
              }}
            />
            <Polyline
              positions={curvedPath}
              pathOptions={{
                color: '#4f46e5',
                weight: 1.5,
                opacity: 0.2,
              }}
            />
          </>
        )}

        <AnimatedPlane path={curvedPath.length > 0 ? curvedPath : null} />
        <FitBounds source={source} destination={destination} />
      </MapContainer>

      {!source && !destination && (
        <div className="map-empty-state">
          <div className="map-empty-icon">🗺️</div>
          <h3>Explore the World</h3>
          <p>Use the AI chat to search for your perfect trip. Your route will appear here with a flying plane animation!</p>
        </div>
      )}

      {(source || destination) && (
        <div className="map-route-info">
          {sourceLabel && (
            <div className="route-point">
              <div className="route-dot source" />
              <span>{sourceLabel}</span>
            </div>
          )}
          {sourceLabel && destLabel && (
            <div className="route-line-connector" />
          )}
          {destLabel && (
            <div className="route-point">
              <div className="route-dot dest" />
              <span>{destLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MapView
