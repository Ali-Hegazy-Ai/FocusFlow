import { useContext, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const FocusAnalytics = () => {
  const { timerState, tasks } = useContext(AppContext)
  const [focusData, setFocusData] = useState({
    weeklyFocus: Array(7).fill(0),
    completedTasks: 0,
    totalPomodoros: 0,
    taskEfficiency: 0
  })
  
  // Process focus data for visualization
  useEffect(() => {
    // Calculate completed tasks
    const completed = tasks.filter(task => task.completed).length
    
    // Calculate total pomodoros across all tasks
    const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoros, 0)
    
    // Calculate task efficiency (completed pomodoros vs estimated)
    const completedTasks = tasks.filter(task => task.completed)
    let efficiency = 0
    
    if (completedTasks.length > 0) {
      const totalEstimated = completedTasks.reduce((sum, task) => sum + task.estimatedPomodoros, 0)
      const actualPomodoros = completedTasks.reduce((sum, task) => sum + task.pomodoros, 0)
      efficiency = totalEstimated > 0 ? Math.round((actualPomodoros / totalEstimated) * 100) : 0
    }
    
    // Generate random weekly data for demonstration
    // In a real app, you would store and retrieve historical focus data
    const today = new Date().getDay()
    const weeklyFocus = Array(7).fill(0).map((_, index) => {
      if (index <= today) {
        return Math.floor(Math.random() * 8) + (index === today ? Math.floor(timerState.totalFocusTime / 60 / 25) : 0)
      }
      return 0
    })
    
    setFocusData({
      weeklyFocus,
      completedTasks: completed,
      totalPomodoros,
      taskEfficiency: efficiency
    })
  }, [timerState, tasks])
  
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxValue = Math.max(...focusData.weeklyFocus, 1)
  
  return (
    <div className="glass-card p-6 flex-1 relative overflow-hidden">
      {/* Subtle accent divider at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-50 dark:from-gray-700 dark:to-gray-900"></div>
      
      <h3 className="section-title flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Focus Analytics
      </h3>
      
      {/* Weekly focus chart */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-3">Weekly Focus Sessions</h4>
        <div className="flex items-end h-32 space-x-2">
          {focusData.weeklyFocus.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <motion.div 
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                style={{ 
                  backgroundColor: index === new Date().getDay() ? 'rgb(55, 65, 81)' : '',
                  opacity: index === new Date().getDay() ? 1 : 0.6
                }}
              ></motion.div>
              <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">{weekdays[index]}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Focus stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div 
          className="bg-gray-50/60 dark:bg-gray-800/40 rounded-lg p-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {focusData.totalPomodoros}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Focus Sessions
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-50/60 dark:bg-gray-800/40 rounded-lg p-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {focusData.completedTasks}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Completed Tasks
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-50/60 dark:bg-gray-800/40 rounded-lg p-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {focusData.taskEfficiency}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Estimation Accuracy
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FocusAnalytics