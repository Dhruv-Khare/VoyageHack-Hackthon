import { FaPlane, FaHotel, FaSuitcase } from 'react-icons/fa'
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md'
import { FiClock, FiMapPin, FiX } from 'react-icons/fi'
import './ResultsPanel.css'

function ResultsPanel({ data, onClose }) {
  if (!data) return null

  const { type, results, fromLabel, toLabel } = data

  const titleMap = {
    flight: `✈️ Flights${fromLabel ? ` from ${fromLabel}` : ''}${toLabel ? ` to ${toLabel}` : ''}`,
    hotel: `🏨 Hotels in ${toLabel || 'your destination'}`,
    package: `🎯 Packages${toLabel ? ` to ${toLabel}` : ''}`,
  }

  return (
    <div className="results-panel">
      <div className="results-panel-header">
        <div className="results-title-area">
          <h3>{titleMap[type]}</h3>
          <span className="results-count">{results.length} results found</span>
        </div>
        <button className="results-close" onClick={onClose}>
          <FiX />
        </button>
      </div>

      <div className="results-scroll">
        {type === 'flight' && results.map((r, i) => (
          <div key={i} className="result-card flight-card">
            <div className="card-top">
              <div className="card-badge flight-badge">
                <FaPlane />
              </div>
              <div className="card-main-info">
                <span className="card-title">{r.airline}</span>
                <span className="card-subtitle">{r.stops} • {r.duration}</span>
              </div>
              <div className="card-price-block">
                <span className="card-price">{r.price}</span>
                <span className="card-price-label">per person</span>
              </div>
            </div>
            <div className="flight-route">
              <div className="flight-endpoint">
                <MdFlightTakeoff className="endpoint-icon" />
                <div>
                  <span className="flight-time">{r.departure}</span>
                  <span className="flight-city">{fromLabel || 'Origin'}</span>
                </div>
              </div>
              <div className="flight-path-line">
                <div className="path-line" />
                <FaPlane className="path-plane" />
                <div className="path-line" />
              </div>
              <div className="flight-endpoint">
                <MdFlightLand className="endpoint-icon" />
                <div>
                  <span className="flight-time">{r.arrival}</span>
                  <span className="flight-city">{toLabel || 'Destination'}</span>
                </div>
              </div>
            </div>
            <button className="card-book-btn">Book Now</button>
          </div>
        ))}

        {type === 'hotel' && results.map((r, i) => (
          <div key={i} className="result-card hotel-card">
            <div className="card-top">
              <div className="card-badge hotel-badge">
                <FaHotel />
              </div>
              <div className="card-main-info">
                <span className="card-title">{r.name}</span>
                <span className="card-subtitle">{r.type} • ⭐ {r.rating}</span>
              </div>
              <div className="card-price-block">
                <span className="card-price">{r.price}</span>
                <span className="card-price-label">per night</span>
              </div>
            </div>
            <div className="card-tags">
              {r.amenities.split(', ').map((a, j) => (
                <span key={j} className="card-tag">{a}</span>
              ))}
            </div>
            <button className="card-book-btn">Book Now</button>
          </div>
        ))}

        {type === 'package' && results.map((r, i) => (
          <div key={i} className="result-card package-card">
            <div className="card-top">
              <div className="card-badge package-badge">
                <FaSuitcase />
              </div>
              <div className="card-main-info">
                <span className="card-title">{r.name}</span>
                <span className="card-subtitle"><FiClock style={{verticalAlign: 'middle'}} /> {r.duration}</span>
              </div>
              <div className="card-price-block">
                <span className="card-price">{r.price}</span>
                <span className="card-price-label">total</span>
              </div>
            </div>
            <div className="package-includes-row">
              <FiMapPin className="includes-icon" />
              <span>{r.includes}</span>
            </div>
            <button className="card-book-btn">Book Package</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsPanel
