import { useContext } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { AppContext } from '../context/AppContext'

const Settings = () => {
  const { settings, updateSettings } = useContext(AppContext)

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  }

  const pageTransition = {
    type: 'tween',
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.4
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      updateSettings({ [name]: checked })
    } else if (type === 'number') {
      updateSettings({ [name]: parseInt(value, 10) })
    } else if (type === 'range') {
      updateSettings({ [name]: parseFloat(value) })
    } else {
      updateSettings({ [name]: value })
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex flex-col items-center"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight"
        >
          Settings
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-sm text-center mb-12 text-gray-500 dark:text-gray-400 max-w-sm tracking-wide"
        >
          Customize timer durations and preferences.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="w-full max-w-xl glass-card p-8 shadow-elevated relative overflow-hidden"
        >
          {/* Subtle accent divider at the top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-50 dark:from-gray-700 dark:to-gray-900"></div>
        
          <form>
            <div className="mb-10">
              <h3 className="section-title flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Timer Durations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="group">
                  <label 
                    htmlFor="pomodoro" 
                    className="label-text group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    Focus (minutes)
                  </label>
                  <input
                    type="number"
                    id="pomodoro"
                    name="pomodoro"
                    min="1"
                    max="60"
                    value={settings.pomodoro}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="group">
                  <label 
                    htmlFor="shortBreak" 
                    className="label-text group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    id="shortBreak"
                    name="shortBreak"
                    min="1"
                    max="30"
                    value={settings.shortBreak}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="group">
                  <label 
                    htmlFor="longBreak" 
                    className="label-text group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    id="longBreak"
                    name="longBreak"
                    min="1"
                    max="60"
                    value={settings.longBreak}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="section-title flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                Auto Start
              </h3>
              <div className="space-y-4 p-4 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl">
                <div className="flex items-center group">
                  <input
                    type="checkbox"
                    id="autoStartBreaks"
                    name="autoStartBreaks"
                    checked={settings.autoStartBreaks}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gray-900 dark:text-white focus:ring-gray-500 border-gray-300 dark:border-gray-700 rounded transition-all duration-300"
                  />
                  <label 
                    htmlFor="autoStartBreaks"
                    className="ml-3 block text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    Auto-start breaks
                  </label>
                </div>
                
                <div className="flex items-center group">
                  <input
                    type="checkbox"
                    id="autoStartPomodoros"
                    name="autoStartPomodoros"
                    checked={settings.autoStartPomodoros}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gray-900 dark:text-white focus:ring-gray-500 border-gray-300 dark:border-gray-700 rounded transition-all duration-300"
                  />
                  <label 
                    htmlFor="autoStartPomodoros" 
                    className="ml-3 block text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    Auto-start pomodoros
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="section-title flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Cycles
              </h3>
              <div className="group p-4 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl">
                <label 
                  htmlFor="longBreakInterval" 
                  className="label-text group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                >
                  Long Break Interval (cycles)
                </label>
                <input
                  type="number"
                  id="longBreakInterval"
                  name="longBreakInterval"
                  min="1"
                  max="10"
                  value={settings.longBreakInterval}
                  onChange={handleInputChange}
                  className="input-field"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 tracking-wide">
                  Number of pomodoros until a long break
                </p>
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="section-title flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Alarm Sound
              </h3>
              <div className="space-y-5 p-4 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl">
                <div className="group">
                  <label 
                    htmlFor="alarmSound"
                    className="label-text group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    Sound
                  </label>
                  <select
                    id="alarmSound"
                    name="alarmSound"
                    value={settings.alarmSound}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="bell">Bell</option>
                    <option value="alarm_clock">Alarm Clock</option>
                    <option value="bellnotifaction">Bell Notification</option>
                    <option value="chopping-wood-96709">Wooden Sound</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                    <span>Volume</span>
                    <span className="font-medium bg-gray-50/80 dark:bg-gray-800/80 py-1 px-2 rounded-md text-xs text-gray-700 dark:text-gray-300">
                      {Math.round(settings.alarmVolume * 100)}%
                    </span>
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg blur-sm group-hover:blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                    <div className="relative">
                      <input
                        type="range"
                        id="alarmVolume"
                        name="alarmVolume"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.alarmVolume}
                        onChange={handleInputChange}
                        className="w-full h-1.5 appearance-none rounded-full outline-none transition-all duration-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 dark:[&::-webkit-slider-thumb]:bg-white"
                        style={{
                          background: 'linear-gradient(to right, #374151, #9CA3AF)',
                          backgroundSize: `${settings.alarmVolume * 100}% 100%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full px-4 py-2.5 flex items-center justify-center text-sm tracking-wide border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
                  onClick={() => {
                    // Map alarm sound names to their actual file names
                    const alarmFileMap = {
                      'bell': 'alarm-bell.mp3',
                      'alarm_clock': 'alarm_clock.mp3',
                      'bellnotifaction': 'bellnotifaction.mp3',
                      'chopping-wood-96709': 'chopping-wood-96709.mp3'
                    }
                    
                    const fileName = alarmFileMap[settings.alarmSound] || 'alarm-bell.mp3'
                    
                    // Create a temporary Howl instance to play the test sound
                    const sound = new Howl({
                      src: [`/audio/${fileName}`],
                      volume: settings.alarmVolume
                    });
                    sound.play();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Sound
                </motion.button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex justify-end">
              <motion.a 
                href="/"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Save & Return
              </motion.a>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Settings