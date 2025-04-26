import { createContext, useState, useEffect } from 'react'

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
  
  // Add tasks management
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('focusflow-tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  
  const [currentTaskId, setCurrentTaskId] = useState(() => {
    const savedCurrentTask = localStorage.getItem('focusflow-current-task')
    return savedCurrentTask || null
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
      backgroundSound: 'none', // 'rain', 'lofi', 'nature', 'none'
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
  
  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks))
  }, [tasks])
  
  // Save current task to localStorage
  useEffect(() => {
    if (currentTaskId) {
      localStorage.setItem('focusflow-current-task', currentTaskId)
    } else {
      localStorage.removeItem('focusflow-current-task')
    }
  }, [currentTaskId])
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }
  
  // Update timer settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }
  
  // Timer controls
  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }))
  }
  
  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }))
  }
  
  const resetTimer = () => {
    const modeMinutes = settings[timerState.mode] || settings.pomodoro
    setTimerState(prev => ({
      ...prev,
      timeLeft: modeMinutes * 60,
      isRunning: false,
    }))
  }
  
  const switchMode = (mode) => {
    const modeMinutes = settings[mode] || settings.pomodoro
    setTimerState(prev => ({
      ...prev,
      mode,
      timeLeft: modeMinutes * 60,
      isRunning: false,
    }))
  }
  
  // Task management functions
  const addTask = (taskName) => {
    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      completed: false,
      createdAt: new Date().toISOString(),
      pomodoros: 0,
      estimatedPomodoros: 1
    }
    setTasks(prev => [newTask, ...prev])
    return newTask.id
  }
  
  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }
  
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    if (currentTaskId === taskId) {
      setCurrentTaskId(null)
    }
  }
  
  const selectTask = (taskId) => {
    setCurrentTaskId(taskId)
  }
  
  const incrementTaskPomodoro = () => {
    if (currentTaskId) {
      setTasks(prev => prev.map(task => 
        task.id === currentTaskId 
          ? { ...task, pomodoros: task.pomodoros + 1 } 
          : task
      ))
    }
  }
  
  // Provide all state and functions to the app
  return (
    <AppContext.Provider
      value={{
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
        tasks,
        currentTaskId,
        addTask,
        updateTask,
        deleteTask,
        selectTask,
        incrementTaskPomodoro
      }}
    >
      {children}
    </AppContext.Provider>
  )
}