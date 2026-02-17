import { useState } from 'react'
import Header from '../components/Header'
import FilterSidebar from '../components/FilterSidebar'
import MapView from '../components/MapView'
import ChatBot from '../components/ChatBot'
import ResultsPanel from '../components/ResultsPanel'
import { FiFilter } from 'react-icons/fi'
import './Dashboard.css'

const DEFAULT_FILTERS = {
  from: '',
  to: '',
  departDate: '',
  returnDate: '',
  budgetMin: '',
  budgetMax: '',
  adults: 1,
  children: 0,
  travelClass: 'Economy',
  themes: [],
  hotelRating: 0,
}

function Dashboard({ user, onLogout }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [routeData, setRouteData] = useState({
    source: null,
    destination: null,
    sourceLabel: '',
    destLabel: '',
  })
  const [searchResults, setSearchResults] = useState(null)

  const handleRouteUpdate = (data) => {
    setRouteData(data)
  }

  const handleResultsUpdate = (data) => {
    setSearchResults(data)
  }

  const handleCloseResults = () => {
    setSearchResults(null)
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />

      <div className="dashboard-body">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className={`dashboard-main ${sidebarOpen ? '' : 'expanded'}`}>
          {!sidebarOpen && (
            <button
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <FiFilter />
              <span>Filters</span>
            </button>
          )}

          <div className="map-container">
            <MapView
              source={routeData.source}
              destination={routeData.destination}
              sourceLabel={routeData.sourceLabel}
              destLabel={routeData.destLabel}
            />

            <ResultsPanel
              data={searchResults}
              onClose={handleCloseResults}
            />
          </div>
        </main>
      </div>

      <ChatBot
        onRouteUpdate={handleRouteUpdate}
        onResultsUpdate={handleResultsUpdate}
      />
    </div>
  )
}

export default Dashboard
