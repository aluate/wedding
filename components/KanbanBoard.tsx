'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize guest list',
    description: 'Review and confirm all invitees',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-01-15'
  },
  {
    id: '2',
    title: 'Book photographer',
    description: 'Research and book wedding photographer',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-02-01'
  },
  {
    id: '3',
    title: 'Order invitations',
    description: 'Design and order physical invitations',
    status: 'review',
    priority: 'medium',
    dueDate: '2026-01-20'
  },
  {
    id: '4',
    title: 'Choose menu',
    description: 'Finalize dinner menu with venue',
    status: 'done',
    priority: 'high'
  }
]

const columns = [
  { id: 'todo', name: 'To Do', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 border-blue-300' },
  { id: 'review', name: 'Review', color: 'bg-purple-100 border-purple-300' },
  { id: 'done', name: 'Done', color: 'bg-green-100 border-green-300' }
]

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== targetStatus) {
      setTasks(tasks.map(task =>
        task.id === draggedTask.id
          ? { ...task, status: targetStatus }
          : task
      ))
    }
    setDraggedTask(null)
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id)
        return (
          <div
            key={column.id}
            className={`border-2 rounded-lg p-4 min-h-[500px] ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task['status'])}
          >
            <h3 className="font-heading text-xl mb-4 font-semibold">
              {column.name} ({columnTasks.length})
            </h3>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className="bg-white p-4 rounded-lg shadow-sm border cursor-move hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{task.title}</h4>
                    {task.priority && (
                      <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">
                  No tasks
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

