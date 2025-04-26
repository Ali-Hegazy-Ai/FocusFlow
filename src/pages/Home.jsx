import { motion } from 'framer-motion'
import { useContext } from 'react'
import Timer from '../components/Timer'
import SessionStats from '../components/SessionStats'
import BackgroundAudioPlayer from '../components/BackgroundAudioPlayer'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const { timerState } = useContext(AppContext)

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
        staggerChildren: 0.15
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
          FocusFlow
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-sm text-center mb-12 text-gray-500 dark:text-gray-400 max-w-sm tracking-wide"
        >
          Stay productive with timed work sessions and regular breaks.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="w-full max-w-xl glass-card p-8 mb-10 shadow-elevated relative overflow-hidden"
        >
          {/* Subtle accent divider at the top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-50 dark:from-gray-700 dark:to-gray-900"></div>
          
          <Timer />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="w-full max-w-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="h-full flex">
              <SessionStats />
            </div>
            <div className="h-full flex">
              <BackgroundAudioPlayer />
            </div>
          </div>
        </motion.div>
        
        {/* Productivity tip section - helpful for focus */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-xl relative"
        >
          <div className="text-center p-5 bg-gray-50/60 dark:bg-gray-800/40 backdrop-blur-xs rounded-xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-3 font-medium">Productivity Tip</h3>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "Focus on one task at a time. Multitasking reduces your efficiency and performance because your brain can only focus on one thing at a time."
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Home