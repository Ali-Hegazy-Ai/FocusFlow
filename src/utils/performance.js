/**
 * Performance optimization utilities
 */

/**
 * Preload critical images
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}

/**
 * Lazy load non-critical resources
 */
export const lazyLoadResource = (url, type = 'script') => {
  return new Promise((resolve, reject) => {
    const element = type === 'script' ? document.createElement('script') : document.createElement('link')
    
    if (type === 'script') {
      element.src = url
      element.async = true
    } else {
      element.href = url
      element.rel = 'stylesheet'
    }
    
    element.onload = resolve
    element.onerror = reject
    
    document.head.appendChild(element)
  })
}

/**
 * Debounce function to limit excessive function calls
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit function calls to once per interval
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Measure performance of a function
 */
export const measurePerformance = (name, fn) => {
  return (...args) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} executed in ${end - start} milliseconds`)
    }
    
    return result
  }
}

/**
 * Check if device has limited resources
 */
export const isLowEndDevice = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Check navigator connection (if available)
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
  
  // Check hardware concurrency (CPU cores)
  const lowCoreCount = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
  
  return prefersReducedMotion || slowConnection || lowCoreCount
}

/**
 * Optimized requestAnimationFrame for smooth animations
 */
export const smoothRaf = (callback) => {
  let ticking = false
  
  return (...args) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(...args)
        ticking = false
      })
      ticking = true
    }
  }
}

/**
 * Memory efficient object pool for frequently created/destroyed objects
 */
export class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.pool = []
    this.maxSize = maxSize
  }
  
  get() {
    if (this.pool.length > 0) {
      return this.pool.pop()
    }
    return this.createFn()
  }
  
  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj)
      this.pool.push(obj)
    }
  }
  
  clear() {
    this.pool.length = 0
  }
}
