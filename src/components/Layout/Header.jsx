import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import ThemeToggle from '../ThemeToggle'

const Header = () => {
  const { theme } = useContext(AppContext)
  
  return (
    <header className="relative z-10 py-5 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="group flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center shadow-md transform transition-transform duration-300 group-hover:scale-105">
            <span className="text-white dark:text-gray-900 font-bold tracking-wider">FF</span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight transition-all duration-300 group-hover:tracking-wide">
            Focus<span className="text-gray-900/80 dark:text-white/80">Flow</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Link 
            to="/settings" 
            className="btn-icon relative overflow-hidden bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 group"
            aria-label="Settings"
          >
            {/* Subtle highlight effect on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-transparent dark:from-gray-700/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header