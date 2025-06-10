import { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { formatTime } from '../utils/formatTime'

const SessionStats = () => {
  const { timerState } = useContext(AppContext)

  // Format total focus time in hours and minutes
  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  return (
    <motion.div 
      className="glass-card p-6 flex-1 relative overflow-hidden"
      whileHover={{ y: -4, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -10px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle accent divider at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-50 dark:from-gray-700 dark:to-gray-900"></div>
      
      <h3 className="section-title flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Session Stats
      </h3>
      
      <div className="space-y-5">
        <div className="flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-400 text-sm tracking-wide group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Completed Cycles</span>
          <span className="font-medium text-gray-900 dark:text-white text-xl tabular-nums bg-gray-50/80 dark:bg-gray-800/80 py-1 px-3 rounded-md">{timerState.cycles}</span>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-400 text-sm tracking-wide group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Focus Time</span>
          <span className="font-medium text-gray-900 dark:text-white tabular-nums bg-gray-50/80 dark:bg-gray-800/80 py-1 px-3 rounded-md">{formatTotalTime(timerState.totalFocusTime)}</span>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-400 text-sm tracking-wide group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Current Mode</span>
          <span className="font-medium capitalize text-gray-900 dark:text-white bg-gray-50/80 dark:bg-gray-800/80 py-1 px-3 rounded-md">
            {timerState.mode === 'pomodoro' ? 'Focus' : timerState.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </span>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-400 text-sm tracking-wide group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Status</span>
          <div className="flex items-center bg-gray-50/80 dark:bg-gray-800/80 py-1 px-3 rounded-md">
            <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
              timerState.isRunning 
                ? 'bg-gray-900 dark:bg-white animate-[pulse_1.5s_ease-in-out_infinite]' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {timerState.isRunning ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SessionStats