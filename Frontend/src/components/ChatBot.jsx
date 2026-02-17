import { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { FaRobot } from 'react-icons/fa'
import './ChatBot.css'

const CITY_COORDS = {
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'hyderabad': [17.3850, 78.4867],
  'pune': [18.5204, 73.8567],
  'jaipur': [26.9124, 75.7873],
  'goa': [15.2993, 74.1240],
  'paris': [48.8566, 2.3522],
  'london': [51.5074, -0.1278],
  'new york': [40.7128, -74.0060],
  'tokyo': [35.6762, 139.6503],
  'dubai': [25.2048, 55.2708],
  'singapore': [1.3521, 103.8198],
  'bangkok': [13.7563, 100.5018],
  'bali': [-8.3405, 115.0920],
  'rome': [41.9028, 12.4964],
  'barcelona': [41.3874, 2.1686],
  'sydney': [-33.8688, 151.2093],
  'maldives': [3.2028, 73.2207],
  'istanbul': [41.0082, 28.9784],
  'los angeles': [34.0522, -118.2437],
  'san francisco': [37.7749, -122.4194],
  'amsterdam': [52.3676, 4.9041],
  'zurich': [47.3769, 8.5417],
  'cairo': [30.0444, 31.2357],
  'cape town': [-33.9249, 18.4241],
  'toronto': [43.6532, -79.3832],
  'hong kong': [22.3193, 114.1694],
  'seoul': [37.5665, 126.9780],
  'kuala lumpur': [3.1390, 101.6869],
}

const MOCK_RESPONSES = {
  flight: {
    results: [
      { airline: 'Air India', departure: '06:30', arrival: '09:15', price: '$245', stops: 'Non-stop', duration: '2h 45m' },
      { airline: 'IndiGo', departure: '10:00', arrival: '12:30', price: '$189', stops: 'Non-stop', duration: '2h 30m' },
      { airline: 'Vistara', departure: '14:45', arrival: '17:30', price: '$312', stops: 'Non-stop', duration: '2h 45m' },
      { airline: 'Emirates', departure: '19:00', arrival: '22:15', price: '$410', stops: '1 Stop', duration: '5h 15m' },
    ]
  },
  hotel: {
    results: [
      { name: 'Grand Palace Hotel', rating: 4.8, price: '$180/night', type: 'Luxury', amenities: 'Pool, Spa, Restaurant' },
      { name: 'City Center Inn', rating: 4.3, price: '$95/night', type: 'Business', amenities: 'WiFi, Gym, Breakfast' },
      { name: 'Heritage Boutique', rating: 4.6, price: '$145/night', type: 'Boutique', amenities: 'Rooftop, Bar, Concierge' },
      { name: 'Skyline Suites', rating: 4.5, price: '$210/night', type: 'Premium', amenities: 'Lounge, Pool, Spa' },
    ]
  },
  package: {
    results: [
      { name: 'Romantic Getaway', price: '$1,850', duration: '5 Days', includes: 'Flight + 4★ Hotel + Airport Transfer + City Tour' },
      { name: 'Adventure Explorer', price: '$2,200', duration: '7 Days', includes: 'Flight + Resort + Transfers + Activities' },
      { name: 'Cultural Discovery', price: '$1,600', duration: '4 Days', includes: 'Flight + Boutique Hotel + Guided Tours' },
    ]
  }
}

function parseQuery(text) {
  const lower = text.toLowerCase()
  let from = null
  let to = null
  let fromLabel = null
  let toLabel = null

  const fromMatch = lower.match(/from\s+([a-z\s]+?)(?:\s+to\s|\s*$)/)
  const toMatch = lower.match(/to\s+([a-z\s]+?)(?:\s+on\s|\s+in\s|\s+for\s|\s+under\s|\s*$)/)

  if (fromMatch) {
    const city = fromMatch[1].trim()
    if (CITY_COORDS[city]) {
      from = CITY_COORDS[city]
      fromLabel = city.charAt(0).toUpperCase() + city.slice(1)
    }
  }

  if (toMatch) {
    const city = toMatch[1].trim()
    if (CITY_COORDS[city]) {
      to = CITY_COORDS[city]
      toLabel = city.charAt(0).toUpperCase() + city.slice(1)
    }
  }

  if (!from && !to) {
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
      if (lower.includes(city)) {
        if (!to) {
          to = coords
          toLabel = city.charAt(0).toUpperCase() + city.slice(1)
        } else if (!from) {
          from = to
          fromLabel = toLabel
          to = coords
          toLabel = city.charAt(0).toUpperCase() + city.slice(1)
        }
      }
    }
  }

  return { from, to, fromLabel, toLabel }
}

function generateResponse(text) {
  const lower = text.toLowerCase()
  const parsed = parseQuery(text)

  const hasFlightIntent = /flight|fly|book|travel|trip|go\s/i.test(lower)
  const hasHotelIntent = /hotel|stay|accommodation|lodge|resort/i.test(lower)
  const hasPackageIntent = /package|bundle|itinerary|plan|romantic|adventure|family|weekend/i.test(lower)

  let responseText = ''
  let resultType = null
  let results = []

  if (hasPackageIntent && parsed.toLabel) {
    responseText = `🎯 Great choice! I found amazing travel packages to **${parsed.toLabel}**${parsed.fromLabel ? ` from ${parsed.fromLabel}` : ''}. Check out the results on the left!`
    resultType = 'package'
    results = MOCK_RESPONSES.package.results
  } else if (hasFlightIntent && (parsed.fromLabel || parsed.toLabel)) {
    responseText = `✈️ Found available flights${parsed.fromLabel ? ` from **${parsed.fromLabel}**` : ''}${parsed.toLabel ? ` to **${parsed.toLabel}**` : ''}! I've displayed the best options for you on the page.`
    resultType = 'flight'
    results = MOCK_RESPONSES.flight.results
  } else if (hasHotelIntent && parsed.toLabel) {
    responseText = `🏨 Here are the top-rated hotels in **${parsed.toLabel}**! Check the results panel for details.`
    resultType = 'hotel'
    results = MOCK_RESPONSES.hotel.results
  } else if (parsed.toLabel) {
    responseText = `🌍 I'd love to help you explore **${parsed.toLabel}**${parsed.fromLabel ? ` from ${parsed.fromLabel}` : ''}! I've pulled together some great packages — take a look at the results!`
    resultType = 'package'
    results = MOCK_RESPONSES.package.results
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    responseText = "👋 Hello! I'm your AI travel assistant. I can help you find flights, hotels, and complete travel packages. Try saying something like:\n\n• \"Find flights from Delhi to Paris\"\n• \"Hotels in Bali\"\n• \"Romantic weekend in Paris from London\""
  } else if (lower.includes('help')) {
    responseText = "🤖 Here's how I can help you:\n\n• **Search Flights** — \"Flights from Mumbai to Dubai\"\n• **Find Hotels** — \"Hotels in Tokyo\"\n• **Plan Trips** — \"Adventure trip to Bali\"\n• **Get Packages** — \"Romantic getaway to Maldives from Delhi\"\n\nJust type your travel query naturally!"
  } else {
    responseText = "I'd love to help you plan your trip! Could you please specify a destination? For example:\n\n• \"Flights from Delhi to London\"\n• \"Hotels in Paris\"\n• \"Plan a trip to Tokyo\""
  }

  return { text: responseText, resultType, results, parsed }
}

function ChatBot({ onRouteUpdate, onResultsUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "👋 Welcome to VoyageAI! I'm your intelligent travel assistant. Tell me where you'd like to go, and I'll find the best flights, hotels, and packages for you.\n\nTry: \"Find flights from Delhi to Paris\" or \"Romantic trip to Bali\"",
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const processQuery = (text) => {
    const userMsg = { id: Date.now(), type: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(text)
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)

      if (response.parsed.from || response.parsed.to) {
        onRouteUpdate({
          source: response.parsed.from,
          destination: response.parsed.to,
          sourceLabel: response.parsed.fromLabel,
          destLabel: response.parsed.toLabel,
        })
      }

      if (response.resultType && response.results.length > 0) {
        onResultsUpdate({
          type: response.resultType,
          results: response.results,
          fromLabel: response.parsed.fromLabel,
          toLabel: response.parsed.toLabel,
        })
      }
    }, 1200)
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    processQuery(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    'Flights Delhi to Paris',
    'Hotels in Bali',
    'Trip to Tokyo',
  ]

  return (
    <>
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <FiMessageCircle />
          <span className="chat-toggle-label">AI Assistant</span>
          <span className="chat-toggle-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <FaRobot />
              </div>
              <div>
                <h4>VoyageAI Assistant</h4>
                <span className="chat-status">
                  <span className="status-dot" />
                  Online
                </span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.type}`}>
                {msg.type === 'bot' && (
                  <div className="msg-avatar">
                    <FaRobot />
                  </div>
                )}
                <div className="msg-content">
                  <div className="msg-bubble">
                    <p dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }} />
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot">
                <div className="msg-avatar">
                  <FaRobot />
                </div>
                <div className="msg-content">
                  <div className="msg-bubble typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-actions">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="quick-action-btn"
                  onClick={() => processQuery(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me about flights, hotels, trips..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <FiSend />
              </button>
            </div>
            <p className="chat-disclaimer">AI-powered • Responses are simulated</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
