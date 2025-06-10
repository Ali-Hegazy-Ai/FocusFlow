import { Routes, Route } from 'react-router-dom'
import { useContext, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Layout/Header'
import { AppContext } from './context/AppContext'

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'))
const Settings = lazy(() => import('./pages/Settings'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
  </div>
)

function App() {
  const { theme } = useContext(AppContext)
  
  // Prevent page scrolling when modal is open
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col bg-gradient-radial from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none mix-blend-soft-light"></div>
        
        {/* Decorative floating shapes - more subtle and refined */}
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-gradient-to-br from-gray-200/30 to-gray-300/30 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-[35rem] h-[35rem] bg-gradient-to-tr from-gray-300/40 to-gray-200/40 dark:from-gray-700/20 dark:to-gray-800/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>
        
        {/* Grid pattern for subtle texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTItN2gxdjFoLTF2LTF6bTUtMWgxdjFoLTF2LTF6bS0xNyA0aDN2MWgtM3YtMXptMCAxaDF2M2gtMXYtM3ptMTggMGgxdjNoLTF2LTN6bS0xOCA0aDN2MWgtM3YtMXptMCAyaDF2LTJoLTF2MnptMTggMGgxdi0yaC0xdjJ6bS0xOCAzaDF2MWgtMXYtMXptMS0xNWgxdjFoLTF2LTF6bTIgMTFoMXYxaC0xdi0xem0xLTExaDF2MWgtMXYtMXptMiA2aDF2MWgtMXYtMXptMi0xMGgxdjFoLTF2LTF6bTIgMGgxdjFoLTF2LTF6bTIgMTRoMXYxaC0xdi0xem0wLTEwaDF2MWgtMXYtMXptMiAwaDN2MWgtM3YtMXptMCAyaDJ2MWgtMnYtMXptMSAxMmgxdjFoLTF2LTF6bS0yLTJoMS0xdjJ6bTAgNGgxdjFoLTF2LTF6bTItMmgxdjFoLTF2LTF6bTItMmgxdjFoLTF2LTF6bTAgMmgxdjFoLTF2LTF6bTItMmgxdjFoLTF2LTF6bTAgMmgxdjJoLTF2LTJ6bTItNGgxdjFoLTF2LTF6bTAtMTZoMS0xdjFoMXYxaC0xdjE0aDF2LTE0aDJ2LTFoLTJ2LTFoLTF6bTUtM2gxdjFoLTF2LTF6bTMgMWgxdjFoLTF2LTF6bTIgMTJoMXYxaC0xdi0xem0wLTEwaDF2MWgtMXYtMXptLTMtMmgxdjFoLTF2LTF6bS0xNCAzaDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTItN2gxdjFoLTF2LTF6bTUtMWgxdjFoLTF2LTF6Ii8+PC9nPjwvc3ZnPg==')] opacity-50 pointer-events-none mix-blend-overlay dark:mix-blend-color-burn"></div>
        
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 relative z-10 max-w-4xl">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 relative z-10">
          <div className="container mx-auto px-4">
            <p className="tracking-wide mb-1">FocusFlow © {new Date().getFullYear()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Minimalist Pomodoro Timer for Maximum Productivity</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App