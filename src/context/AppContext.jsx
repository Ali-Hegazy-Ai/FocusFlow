import { createContext, useState, useEffect, useMemo, useCallback } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('focusflow-theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  
  const [timerState, setTimerState] = useState({
    mode: 'pomodoro', // pomodoro, shortBreak, longBreak
    timeLeft: 25 * 60, // 25 minutes in seconds
    isRunning: false,
    cycles: 0,
    totalFocusTime: 0,
  })
  
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('focusflow-settings')
    return savedSettings ? JSON.parse(savedSettings) : {
      pomodoro: 25, // minutes
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      longBreakInterval: 4,
      alarmSound: 'bell',
      alarmVolume: 0.8,
      backgroundSound: 'none', // 'rain', 'nature', 'coffee', 'quran', 'none'
      backgroundVolume: 0.3,
    }
  })
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('focusflow-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('focusflow-settings', JSON.stringify(settings))
  }, [settings])
  
  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }, [])
  
  // Update timer settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])
  
  // Timer controls
  const startTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: true }))
  }, [])
  
  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false }))
  }, [])
  
  const resetTimer = useCallback(() => {
    const modeMinutes = settings[timerState.mode] || settings.pomodoro
    setTimerState(prev => ({
      ...prev,
      timeLeft: modeMinutes * 60,
      isRunning: false,
    }))
  }, [settings, timerState.mode])
  
  const switchMode = useCallback((mode) => {
    const modeMinutes = settings[mode] || settings.pomodoro
    setTimerState(prev => ({
      ...prev,
      mode,
      timeLeft: modeMinutes * 60,
      isRunning: false,
    }))
  }, [settings])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    timerState,
    setTimerState,
    settings,
    updateSettings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  }), [
    theme,
    toggleTheme,
    timerState,
    settings,
    updateSettings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  ])
  
  // Provide all state and functions to the app
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}