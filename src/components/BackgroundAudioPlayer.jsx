import { useContext, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { AppContext } from '../context/AppContext'

// Base URL for audio files - using jsDelivr CDN which works well with GitHub files
const AUDIO_BASE_URL = 'https://cdn.jsdelivr.net/gh/Ali-Hegazy-Ai/FocusFlow@main/src/pages/'

const BackgroundAudioPlayer = () => {
  const { settings, updateSettings } = useContext(AppContext)     
  const [isPlaying, setIsPlaying] = useState(false)
  const soundRef = useRef(null)
  
  // Setup and manage audio playback with Howler.js
  useEffect(() => {
    // Stop any currently playing sound
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current = null
      setIsPlaying(false)
    }
    
    if (settings.backgroundSound !== 'none' && settings.backgroundSound !== 'quran') {
      const currentSound = backgroundSounds.find(s => s.id === settings.backgroundSound)
      
      // If we have a file path for the selected sound
      if (currentSound && currentSound.file) {
        // Create a new Howl instance with proper looping
        soundRef.current = new Howl({
          src: [currentSound.file],
          loop: true,
          volume: settings.backgroundVolume,
          autoplay: true,
          html5: true, // Better for streaming and long sounds
          onend: function() {
            console.log('Sound finished but should be looping');
          },
          onloaderror: function() {
            console.error('Error loading sound file:', currentSound.file);
          },
          onplayerror: function() {
            console.error('Error playing sound file:', currentSound.file);
            
            // Try to recover from any play errors by forcing a stop and a fresh play
            soundRef.current.once('unlock', function() {
              soundRef.current.play();
            });
          }
        })
        
        // Ensure the sound starts playing
        soundRef.current.play();
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(false)
    }
    
    // Cleanup function
    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current = null
      }
    }
  }, [settings.backgroundSound])
  
  // Handle volume changes
  useEffect(() => {
    if (soundRef.current && settings.backgroundSound !== 'none') {
      soundRef.current.volume(settings.backgroundVolume)
    }
  }, [settings.backgroundVolume])

  const handleSoundChange = (soundId) => {
    if (soundId === settings.backgroundSound) {
      // If clicking the same sound, toggle it off
      updateSettings({ backgroundSound: 'none' })
    } else {
      updateSettings({ backgroundSound: soundId })
    }
  }
  
  const handleVolumeChange = (e) => {
    updateSettings({ backgroundVolume: parseFloat(e.target.value) })
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
                // TODO: Replace with your Quran website link
                // window.open('https://your-quran-website-link.com', '_blank');
                console.log('Redirect to Quran link');
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