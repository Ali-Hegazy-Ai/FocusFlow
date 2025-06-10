import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Optimized localStorage hook with error handling and JSON parsing
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist
 */
export const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Listen for changes to this localStorage key in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}

/**
 * Hook for localStorage with automatic throttling to prevent excessive writes
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @param {number} throttleMs - Throttle delay in milliseconds (default: 1000)
 */
export const useThrottledLocalStorage = (key, defaultValue, throttleMs = 1000) => {
  const [storedValue, setStoredValue] = useLocalStorage(key, defaultValue)
  const timeoutRef = useRef(null)

  const setThrottledValue = useCallback((value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setStoredValue(value)
    }, throttleMs)
  }, [setStoredValue, throttleMs])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [storedValue, setThrottledValue]
}
