import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { AppContext } from '../context/AppContext'

const BackgroundAudioPlayer = () => {
  const { settings, updateSettings } = useContext(AppContext)
  const [isPlaying, setIsPlaying] = useState(false)
  const soundRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  const backgroundSounds = [
    { id: 'none', name: 'None', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    )},
    { id: 'rain', name: 'Rain', file: '/audio/calming-rain-257596.mp3', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1,3" d="M7 19v1M12 19v1M17 19v1" />
      </svg>
    )},
    { id: 'quran', name: 'Quran', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: 'nature', name: 'Nature', file: '/audio/forest-nature-322637.mp3', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 002 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'coffee', name: 'Cafe', file: '/audio/cafe-noise-32940.mp3', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      </svg>
    )},
  ]

  // Setup and manage audio playback with Howler.js - optimized
  useEffect(() => {
    // Cleanup function for current sound
    const cleanupCurrentSound = () => {
      if (soundRef.current) {
        soundRef.current.unload()
        soundRef.current = null
        setIsPlaying(false)
        setIsLoading(false)
      }
    }

    cleanupCurrentSound()
    
    if (settings.backgroundSound !== 'none' && settings.backgroundSound !== 'quran') {
      const currentSound = backgroundSounds.find(s => s.id === settings.backgroundSound)
      
      if (currentSound && currentSound.file) {
        setIsLoading(true)
        
        soundRef.current = new Howl({
          src: [currentSound.file],
          loop: true,
          volume: settings.backgroundVolume,
          html5: true,
          preload: true,
          onload: () => {
            setIsLoading(false)
            setIsPlaying(true)
            soundRef.current?.play()
          },
          onloaderror: (id, error) => {
            console.warn(`Failed to load audio: ${currentSound.file}`, error)
            setIsLoading(false)
            setIsPlaying(false)
          },
          onplayerror: (id, error) => {
            console.warn(`Failed to play audio: ${currentSound.file}`, error)
            setIsPlaying(false)
          }
        })
      }
    }
    
    // Cleanup function
    return cleanupCurrentSound
  }, [settings.backgroundSound])
  
  // Handle volume changes
  useEffect(() => {
    if (soundRef.current && settings.backgroundSound !== 'none') {
      soundRef.current.volume(settings.backgroundVolume)
    }
  }, [settings.backgroundVolume])

  const handleSoundChange = useCallback((soundId) => {
    if (soundId === settings.backgroundSound) {
      // If clicking the same sound, toggle it off
      updateSettings({ backgroundSound: 'none' })
    } else {
      updateSettings({ backgroundSound: soundId })
    }
  }, [settings.backgroundSound, updateSettings])
  
  const handleVolumeChange = useCallback((e) => {
    updateSettings({ backgroundVolume: parseFloat(e.target.value) })
  }, [updateSettings])
  
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        Background Sounds
      </h3>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {backgroundSounds.map((sound) => (
          <motion.button
            key={sound.id}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            onClick={() => handleSoundChange(sound.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
              settings.backgroundSound === sound.id && sound.id !== 'none'
                ? 'border-gray-300 dark:border-gray-600 bg-gray-100/80 dark:bg-gray-800/80 shadow-sm'
                : 'border-transparent hover:bg-gray-50/80 dark:hover:bg-gray-900/60'
            }`}
          >
            <span className={`mb-2 ${settings.backgroundSound === sound.id && sound.id !== 'none' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {sound.icon}
            </span>
            <span className={`text-xs tracking-wide ${settings.backgroundSound === sound.id && sound.id !== 'none' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              {sound.name}
            </span>
          </motion.button>
        ))}
      </div>
      
      <div className={`transition-opacity duration-300 ${settings.backgroundSound === 'none' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* Quran redirect button (only visible when Quran is selected) */}
        {settings.backgroundSound === 'quran' && (
          <div className="mb-4 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl p-4 flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300 flex items-center"
              onClick={() => {
                window.open('https://quran.com/radio', '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Go to Quran Website
            </motion.button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Click the button above to access the Quran recitation website
            </p>
          </div>
        )}
        
        <label className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
          <span>Volume</span>
          <span className="font-medium bg-gray-50/80 dark:bg-gray-800/80 py-1 px-2 rounded-md text-xs text-gray-700 dark:text-gray-300">
            {Math.round(settings.backgroundVolume * 100)}%
          </span>
        </label>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg blur-sm group-hover:blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.backgroundVolume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 appearance-none rounded-full outline-none transition-all duration-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 dark:[&::-webkit-slider-thumb]:bg-white"
              style={{
                background: 'linear-gradient(to right, #374151, #9CA3AF)',
                backgroundSize: `${settings.backgroundVolume * 100}% 100%`,
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 tracking-wide">
        {isPlaying && settings.backgroundSound !== 'none' && settings.backgroundSound !== 'quran' ? (
          <div className="flex items-center bg-gray-50/80 dark:bg-gray-800/80 rounded-lg py-2 px-3 mt-3">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 dark:bg-gray-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-600 dark:bg-gray-400"></span>
            </span>
            <span>
              Now playing: <span className="font-medium text-gray-700 dark:text-gray-300">
                {backgroundSounds.find(s => s.id === settings.backgroundSound)?.name}
              </span>
            </span>
          </div>
        ) : (
          <span className="italic block bg-gray-50/80 dark:bg-gray-800/80 rounded-lg py-2 px-3 mt-3">
            {settings.backgroundSound === 'quran'
              ? "Click the button above to access Quran recitations"
              : "Background sounds can help improve focus and concentration"}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default BackgroundAudioPlayer