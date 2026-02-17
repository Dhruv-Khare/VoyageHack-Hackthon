import { useState } from 'react'
import {
  FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiChevronDown, FiChevronUp,
  FiFilter, FiX, FiStar
} from 'react-icons/fi'
import { MdFlightClass, MdLocalActivity } from 'react-icons/md'
import './FilterSidebar.css'

const THEMES = [
  { id: 'romantic', label: 'Romantic', emoji: '💕' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
]

const TRAVEL_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class']
const HOTEL_RATINGS = [5, 4, 3, 2]

function FilterSidebar({ filters, onFilterChange, isOpen, onToggle }) {
  const [expandedSections, setExpandedSections] = useState({
    destination: true,
    dates: true,
    budget: true,
    travelers: true,
    class: false,
    themes: true,
    rating: false,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const toggleTheme = (themeId) => {
    const current = filters.themes || []
    const updated = current.includes(themeId)
      ? current.filter(t => t !== themeId)
      : [...current, themeId]
    handleChange('themes', updated)
  }

  const clearAll = () => {
    onFilterChange({
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
    })
  }

  return (
    <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="filter-header">
        <div className="filter-header-title">
          <FiFilter />
          <h3>Filters</h3>
        </div>
        <div className="filter-header-actions">
          <button className="clear-btn" onClick={clearAll}>Clear All</button>
          <button className="close-filter-btn" onClick={onToggle}>
            <FiX />
          </button>
        </div>
      </div>

      <div className="filter-content">
        {/* Destination Section */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('destination')}>
            <div className="section-label">
              <FiMapPin />
              <span>Destination</span>
            </div>
            {expandedSections.destination ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.destination && (
            <div className="section-content">
              <div className="filter-field">
                <label>From</label>
                <input
                  type="text"
                  placeholder="Departure city"
                  value={filters.from}
                  onChange={(e) => handleChange('from', e.target.value)}
                />
              </div>
              <div className="filter-field">
                <label>To</label>
                <input
                  type="text"
                  placeholder="Destination city"
                  value={filters.to}
                  onChange={(e) => handleChange('to', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dates Section */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('dates')}>
            <div className="section-label">
              <FiCalendar />
              <span>Travel Dates</span>
            </div>
            {expandedSections.dates ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.dates && (
            <div className="section-content">
              <div className="filter-field">
                <label>Departure</label>
                <input
                  type="date"
                  value={filters.departDate}
                  onChange={(e) => handleChange('departDate', e.target.value)}
                />
              </div>
              <div className="filter-field">
                <label>Return</label>
                <input
                  type="date"
                  value={filters.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Budget Section */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('budget')}>
            <div className="section-label">
              <FiDollarSign />
              <span>Budget</span>
            </div>
            {expandedSections.budget ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.budget && (
            <div className="section-content">
              <div className="filter-row">
                <div className="filter-field">
                  <label>Min ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.budgetMin}
                    onChange={(e) => handleChange('budgetMin', e.target.value)}
                  />
                </div>
                <div className="filter-field">
                  <label>Max ($)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={filters.budgetMax}
                    onChange={(e) => handleChange('budgetMax', e.target.value)}
                  />
                </div>
              </div>
              <div className="budget-slider">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.budgetMax || 5000}
                  onChange={(e) => handleChange('budgetMax', e.target.value)}
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$10,000</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Travelers Section */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('travelers')}>
            <div className="section-label">
              <FiUsers />
              <span>Travelers</span>
            </div>
            {expandedSections.travelers ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.travelers && (
            <div className="section-content">
              <div className="counter-row">
                <div className="counter-label">
                  <strong>Adults</strong>
                  <span>12+ years</span>
                </div>
                <div className="counter-controls">
                  <button
                    className="counter-btn"
                    onClick={() => handleChange('adults', Math.max(1, filters.adults - 1))}
                    disabled={filters.adults <= 1}
                  >
                    −
                  </button>
                  <span className="counter-value">{filters.adults}</span>
                  <button
                    className="counter-btn"
                    onClick={() => handleChange('adults', filters.adults + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="counter-row">
                <div className="counter-label">
                  <strong>Children</strong>
                  <span>2-11 years</span>
                </div>
                <div className="counter-controls">
                  <button
                    className="counter-btn"
                    onClick={() => handleChange('children', Math.max(0, filters.children - 1))}
                    disabled={filters.children <= 0}
                  >
                    −
                  </button>
                  <span className="counter-value">{filters.children}</span>
                  <button
                    className="counter-btn"
                    onClick={() => handleChange('children', filters.children + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Travel Class */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('class')}>
            <div className="section-label">
              <MdFlightClass />
              <span>Travel Class</span>
            </div>
            {expandedSections.class ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.class && (
            <div className="section-content">
              <div className="class-options">
                {TRAVEL_CLASSES.map(cls => (
                  <button
                    key={cls}
                    className={`class-chip ${filters.travelClass === cls ? 'active' : ''}`}
                    onClick={() => handleChange('travelClass', cls)}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Themes */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('themes')}>
            <div className="section-label">
              <MdLocalActivity />
              <span>Trip Theme</span>
            </div>
            {expandedSections.themes ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.themes && (
            <div className="section-content">
              <div className="theme-grid">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-chip ${(filters.themes || []).includes(theme.id) ? 'active' : ''}`}
                    onClick={() => toggleTheme(theme.id)}
                  >
                    <span className="theme-emoji">{theme.emoji}</span>
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hotel Rating */}
        <div className="filter-section">
          <button className="section-toggle" onClick={() => toggleSection('rating')}>
            <div className="section-label">
              <FiStar />
              <span>Hotel Rating</span>
            </div>
            {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.rating && (
            <div className="section-content">
              <div className="rating-options">
                {HOTEL_RATINGS.map(rating => (
                  <button
                    key={rating}
                    className={`rating-chip ${filters.hotelRating === rating ? 'active' : ''}`}
                    onClick={() => handleChange('hotelRating', filters.hotelRating === rating ? 0 : rating)}
                  >
                    {Array.from({ length: rating }, (_, i) => (
                      <FiStar key={i} className="star-icon" />
                    ))}
                    <span>& up</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="filter-footer">
        <button className="apply-filters-btn" onClick={onToggle}>
          <FiFilter />
          Apply Filters
        </button>
      </div>
    </aside>
  )
}

export default FilterSidebar
