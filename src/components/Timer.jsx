import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import { AppContext } from '../context/AppContext'
import { formatTime } from '../utils/formatTime'

const Timer = () => {
  const { 
    timerState, 
    setTimerState, 
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode
  } = useContext(AppContext)
  
  const [progress, setProgress] = useState(100)
  const alarmSoundRef = useRef(null)

  // Initialize alarm sound
  useEffect(() => {
    if (!alarmSoundRef.current) {
      // Map alarm sound names to their actual file names
      const alarmFileMap = {
        'bell': 'alarm-bell.mp3',
        'alarm_clock': 'alarm_clock.mp3',
        'bellnotifaction': 'bellnotifaction.mp3',
        'chopping-wood-96709': 'chopping-wood-96709.mp3'
      }
      
      const fileName = alarmFileMap[settings.alarmSound] || 'alarm-bell.mp3'
      
      alarmSoundRef.current = new Howl({
        src: [`/audio/${fileName}`],
        volume: settings.alarmVolume,
        preload: true,
        onloaderror: () => {
          console.warn('Could not load alarm sound, using console log instead')
        }
      })
    } else {
      alarmSoundRef.current.volume(settings.alarmVolume)
    }
  }, [settings.alarmSound, settings.alarmVolume])
  
  // Memoize total time calculation to avoid recalculations
  const getTotalTime = useCallback(() => {
    switch(timerState.mode) {
      case 'shortBreak':
        return settings.shortBreak * 60
      case 'longBreak':
        return settings.longBreak * 60
      default:
        return settings.pomodoro * 60
    }
  }, [timerState.mode, settings.shortBreak, settings.longBreak, settings.pomodoro])

  // Memoize time display values
  const { minutes, seconds } = useMemo(() => ({
    minutes: Math.floor(timerState.timeLeft / 60),
    seconds: timerState.timeLeft % 60
  }), [timerState.timeLeft])

  // Initialize alarm sound
  useEffect(() => {
    if (!alarmSoundRef.current) {
      alarmSoundRef.current = new Howl({
        src: [`/audio/alarm-${settings.alarmSound}.mp3`],
        volume: settings.alarmVolume,
        preload: true
      })
    } else {
      // Update volume when settings change
      alarmSoundRef.current.volume(settings.alarmVolume)
    }
  }, [settings.alarmSound, settings.alarmVolume])

  // Play alarm sound function
  const playAlarmSound = useCallback(() => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play()
    }
  }, [])
  
  // Timer logic - optimized with single useEffect
  useEffect(() => {
    let interval = null
    
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          totalFocusTime: prev.mode === 'pomodoro' ? prev.totalFocusTime + 1 : prev.totalFocusTime
        }))
      }, 1000)
    } else if (timerState.isRunning && timerState.timeLeft === 0) {
      // Timer completed logic
      playAlarmSound()
      
      // Handle cycle completion if it was a pomodoro
      if (timerState.mode === 'pomodoro') {
        const newCycles = timerState.cycles + 1
        const isLongBreakDue = newCycles % settings.longBreakInterval === 0
        
        setTimerState(prev => ({
          ...prev,
          isRunning: false,
          cycles: newCycles
        }))
        
        // Automatically switch to appropriate break
        if (isLongBreakDue) {
          if (settings.autoStartBreaks) {
            switchMode('longBreak')
            setTimeout(startTimer, 100) // Small delay to ensure state update
          } else {
            switchMode('longBreak')
          }
        } else {
          if (settings.autoStartBreaks) {
            switchMode('shortBreak')
            setTimeout(startTimer, 100)
          } else {
            switchMode('shortBreak')
          }
        }
      } else {
        // Coming back from a break
        setTimerState(prev => ({
          ...prev,
          isRunning: false
        }))
        
        if (settings.autoStartPomodoros) {
          switchMode('pomodoro')
          setTimeout(startTimer, 100)
        } else {
          switchMode('pomodoro')
        }
      }
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerState.isRunning, timerState.timeLeft, timerState.mode, timerState.cycles, settings, setTimerState, startTimer, switchMode, playAlarmSound])
  
  // Update progress bar - optimized
  useEffect(() => {
    const totalTime = getTotalTime()
    const newProgress = totalTime > 0 ? (timerState.timeLeft / totalTime) * 100 : 0
    setProgress(newProgress)
  }, [timerState.timeLeft, getTotalTime])
  
  // Mode switch handlers
  const handleModeSwitch = (mode) => {
    if (mode !== timerState.mode) {
      switchMode(mode)
    }
  }

  // Calculate the remaining minutes and seconds for display
  const displayMinutes = Math.floor(timerState.timeLeft / 60)
  const displaySeconds = timerState.timeLeft % 60
  
  return (
    <div className="flex flex-col items-center">
      {/* Mode selector with refined appearance */}
      <div className="flex space-x-1 mb-10 p-1 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-inner-light dark:shadow-inner-dark">
        <button 
          onClick={() => handleModeSwitch('pomodoro')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            timerState.mode === 'pomodoro' 
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-elevated' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Focus
        </button>
        <button 
          onClick={() => handleModeSwitch('shortBreak')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            timerState.mode === 'shortBreak' 
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-elevated' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Short Break
        </button>
        <button 
          onClick={() => handleModeSwitch('longBreak')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            timerState.mode === 'longBreak' 
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-elevated' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Long Break
        </button>
      </div>
      
      {/* Timer display - improved with refinements */}
      <div className="relative w-72 h-72 mb-12">
        {/* Background circle with soft blur effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100/50 to-gray-50/50 dark:from-gray-800/30 dark:to-gray-900/30 blur-xs transform scale-105 z-0"></div>
        
        <motion.div 
          className="absolute inset-0 glass-card rounded-full flex items-center justify-center overflow-hidden shadow-elevated"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Subtle highlight at the top of the timer circle */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent dark:from-white/5 dark:to-transparent z-0 pointer-events-none"></div>
          
          <div className="text-center z-10 px-4">
            {/* Time display with individual digit animations */}
            <div className="flex justify-center items-center relative">
              <AnimatePresence mode="popLayout">
                <motion.div 
                  key={`min-${displayMinutes}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-7xl font-bold tracking-tighter tabular-nums"
                >
                  {displayMinutes.toString().padStart(2, '0')}
                </motion.div>
                <div className="text-7xl font-bold mx-2 text-gray-800 dark:text-gray-200 opacity-60">:</div>
                <motion.div 
                  key={`sec-${displaySeconds}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-7xl font-bold tracking-tighter tabular-nums"
                >
                  {displaySeconds.toString().padStart(2, '0')}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {timerState.mode === 'pomodoro' ? 'Focus Time' : timerState.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
          </div>
        </motion.div>
        
        {/* Progress ring with improved styling */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90 z-0">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-200/60 dark:text-gray-700/40"
          />
          {/* Progress indicator */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="282.74"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 282.74 - (282.74 * progress) / 100 }}
            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
            className="text-gray-900 dark:text-white"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Timer controls with improved styling */}
      <div className="flex space-x-4">
        {!timerState.isRunning ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            className="btn-primary min-w-[120px] flex items-center justify-center"
            onClick={startTimer}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            className="btn-secondary min-w-[120px] flex items-center justify-center"
            onClick={pauseTimer}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pause
          </motion.button>
        )}
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', scale: 1.05 }}
          className="btn-icon aspect-square flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80"
          onClick={resetTimer}
          title="Reset Timer"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

export default Timer