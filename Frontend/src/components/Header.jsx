import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGlobe } from 'react-icons/fa'
import { FiSearch, FiUser, FiBell, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi'
import { MdFlightTakeoff, MdHotel, MdDirectionsCar, MdExplore } from 'react-icons/md'
import './Header.css'

function Header({ user, onLogout }) {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setShowUserMenu(false)
    onLogout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="header-brand">
            <FaGlobe className="header-logo" />
            <span className="header-title">VoyageAI</span>
          </div>

          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#" className="nav-link active">
              <MdFlightTakeoff />
              <span>Flights</span>
            </a>
            <a href="#" className="nav-link">
              <MdHotel />
              <span>Hotels</span>
            </a>
            <a href="#" className="nav-link">
              <MdDirectionsCar />
              <span>Transfers</span>
            </a>
            <a href="#" className="nav-link">
              <MdExplore />
              <span>Packages</span>
            </a>
          </nav>
        </div>

        <div className="header-right">
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Quick search..." />
          </div>

          <button className="header-icon-btn notification-btn">
            <FiBell />
            <span className="notification-dot" />
          </button>

          <div className="user-menu-container" ref={userMenuRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <FiChevronDown className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <strong>{user?.name || 'User'}</strong>
                    <span>{user?.email || 'user@example.com'}</span>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <a href="#" className="dropdown-item">
                  <FiUser />
                  My Profile
                </a>
                <a href="#" className="dropdown-item">
                  <MdFlightTakeoff />
                  My Bookings
                </a>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
