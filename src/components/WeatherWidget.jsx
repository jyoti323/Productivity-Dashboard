import React, { useEffect, useState } from 'react'
import { fetchWeather } from '../services/weatherService'

// Weather condition codes from Open-Meteo
const getWeatherDesc = (code) => {
  if (code === 0)           return { label: 'Clear Sky',       icon: '☀️' }
  if (code <= 3)            return { label: 'Partly Cloudy',   icon: '⛅' }
  if (code <= 48)           return { label: 'Foggy',           icon: '🌫️' }
  if (code <= 67)           return { label: 'Rainy',           icon: '🌧️' }
  if (code <= 77)           return { label: 'Snowy',           icon: '❄️' }
  if (code <= 82)           return { label: 'Showers',         icon: '🌦️' }
  return                           { label: 'Thunderstorm',    icon: '⛈️' }
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    fetchWeather()
      .then((data) => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const cardStyle = {
    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 60%, #a5b4fc 100%)',
    color: 'white',
    borderRadius: 'var(--radius-md)',
    padding: '22px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid rgba(255,255,255,0.1)',
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }

  if (loading) return (
    <div style={cardStyle}>
      <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>
         Fetching weather...
      </p>
    </div>
  )

  if (error) return (
    <div style={cardStyle}>
      <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
         Could not load weather
      </p>
    </div>
  )

  const desc = getWeatherDesc(weather.weathercode)

  return (
    <div style={cardStyle}>
      <div>
        <p style={{ fontSize: '0.78rem', opacity: 0.8, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
          📍 New Delhi, India
        </p>
        <p style={{ fontSize: '0.82rem', opacity: 0.75 }}>
          Live Weather · Open-Meteo API
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', marginTop: 16 }}>
        <div>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>
            {Math.round(weather.temperature)}°C
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9,
            marginTop: 6, fontWeight: 500 }}>
            {desc.label}
          </div>
          <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: 4 }}>
             Wind: {weather.windspeed} km/h
          </div>
        </div>
        <div style={{ fontSize: '4rem', opacity: 0.9 }}>
          {desc.icon}
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget