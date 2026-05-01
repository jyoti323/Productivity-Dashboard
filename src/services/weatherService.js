import axios from 'axios'

// Using Open-Meteo API — completely free, no API key needed
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export const fetchWeather = async (latitude = 28.6139, longitude = 77.209) => {
  // Default: New Delhi coordinates
  const response = await axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      current_weather: true,
    },
  })
  return response.data.current_weather
}