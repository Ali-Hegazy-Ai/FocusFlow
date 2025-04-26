import { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const TaskList = () => {
  const { 
    tasks, 
    currentTaskId, 
    addTask, 
    updateTask, 
    deleteTask, 
    selectTask 
  } = useContext(AppContext)
  
  const [newTaskName, setNewTaskName] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTaskName, setEditingTaskName] = useState('')
  
  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTaskName.trim()) {
      addTask(newTaskName.trim())
      setNewTaskName('')
    }
  }
  
  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setEditingTaskId(taskId)
      setEditingTaskName(task.name)
    }
  }
  
  const handleUpdateTask = (e) => {
    e.preventDefault()
    if (editingTaskName.trim() && editingTaskId) {
      updateTask(editingTaskId, { name: editingTaskName.trim() })
      setEditingTaskId(null)
      setEditingTaskName('')
    }
  }
  
  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditingTaskName('')
  }
  
  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      updateTask(taskId, { completed: !task.completed })
    }
  }
  
  const handleChangeEstimate = (taskId, change) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const newEstimate = Math.max(1, task.estimatedPomodoros + change)
      updateTask(taskId, { estimatedPomodoros: newEstimate })
    }
  }
  
  return (
    <div className="glass-card p-6 flex-1 relative overflow-hidden">
      {/* Subtle accent divider at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-50 dark:from-gray-700 dark:to-gray-900"></div>
      
      <h3 className="section-title flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Tasks
      </h3>
      
      {/* Add task form */}
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow py-2 px-3 rounded-l-lg bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-sm"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-gray-800 dark:bg-gray-700 text-white rounded-r-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
          >
            Add
          </button>
        </div>
      </form>
      
      {/* Task list */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm italic"
            >
              No tasks yet. Add a task to get started!
            </motion.div>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-lg border ${
                  currentTaskId === task.id
                    ? 'bg-gray-100/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600'
                    : 'bg-white/70 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
                } ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                {editingTaskId === task.id ? (
                  <form onSubmit={handleUpdateTask} className="flex items-center">
                    <input
                      type="text"
                      value={editingTaskName}
                      onChange={(e) => setEditingTaskName(e.target.value)}
                      className="flex-grow py-1 px-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-sm"
                      autoFocus
                    />
                    <div className="flex space-x-1 ml-2">
                      <button
                        type="submit"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-grow min-w-0">
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`p-1 mr-2 rounded-full border ${
                          task.completed
                            ? 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => selectTask(task.id)}
                        className={`text-left flex-grow truncate mr-2 ${
                          task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}
                      >
                        {task.name}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        <button
                          onClick={() => handleChangeEstimate(task.id, -1)}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          disabled={task.estimatedPomodoros <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-2 flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">{task.pomodoros}</span>
                          <span className="text-gray-400 dark:text-gray-500 mx-1">/</span>
                          <span className="text-gray-500 dark:text-gray-400">{task.estimatedPomodoros}</span>
                        </span>
                        <button
                          onClick={() => handleChangeEstimate(task.id, 1)}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditTask(task.id)}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Current task display */}
      {currentTaskId && (
        <div className="mt-4 p-3 bg-gray-50/60 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Current Focus</h4>
          <div className="font-medium">
            {tasks.find(t => t.id === currentTaskId)?.name}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList