import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { FaGlobe, FaPlane, FaShieldAlt, FaBolt } from 'react-icons/fa'
import './Signup.css'

function Signup({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!agreed) {
      setError('Please agree to the Terms & Conditions')
      return
    }

    setLoading(true)
    setTimeout(() => {
      onLogin({ name: formData.fullName, email: formData.email })
      setLoading(false)
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-left-content">
          <div className="signup-brand">
            <FaGlobe className="brand-icon" />
            <h1>VoyageAI</h1>
          </div>
          <h2 className="signup-tagline">Start Your Journey Today</h2>
          <p className="signup-description">
            Join thousands of smart travelers who plan trips faster with AI-powered search and booking.
          </p>

          <div className="signup-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaBolt />
              </div>
              <div>
                <strong>Instant AI Itineraries</strong>
                <p>Get complete trip plans in seconds, not hours</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaPlane />
              </div>
              <div>
                <strong>Best Price Guarantee</strong>
                <p>Compare across 800+ airlines and 3M+ hotels</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaShieldAlt />
              </div>
              <div>
                <strong>Secure Booking</strong>
                <p>Your data is encrypted and payments are secure</p>
              </div>
            </div>
          </div>

          <div className="signup-stats">
            <div className="stat">
              <span className="stat-number">2M+</span>
              <span className="stat-label">Trips Planned</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
            <div className="stat">
              <span className="stat-number">35%</span>
              <span className="stat-label">Avg. Savings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form-container">
          <div className="signup-form-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <FiPhone className="input-icon" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Create Account
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
