import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Custom hook to monitor component performance
 * @param {string} componentName - Name of the component to track
 */
export const usePerformanceMonitor = (componentName) => {
  const renderStartTime = useRef(Date.now())
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    const renderTime = Date.now() - renderStartTime.current
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered in ${renderTime}ms (render #${renderCount.current})`)
    }
    
    renderStartTime.current = Date.now()
  })

  return renderCount.current
}

/**
 * Custom hook for debouncing values to prevent excessive re-renders
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for throttling function calls
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 */
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}
