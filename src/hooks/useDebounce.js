import { useState, useEffect } from 'react'

// Returns a debounced version of the value
// Waits 'delay' ms after user stops typing before updating

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel timer if value changes before delay
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce