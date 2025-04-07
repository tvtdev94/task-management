import { createContext, useContext, useState, ReactNode } from 'react'
import { KanbanTask } from '@/types/kanban'
import { defaultTasks } from '../data/mock'

interface KanbanContextType {
  tasks: KanbanTask[]
  setTasks: (tasks: KanbanTask[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterStatus: string[]
  setFilterStatus: (status: string[]) => void
  filterPriority: string[]
  setFilterPriority: (priority: string[]) => void
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined)

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<KanbanTask[]>(defaultTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [filterPriority, setFilterPriority] = useState<string[]>([])

  return (
    <KanbanContext.Provider
      value={{
        tasks,
        setTasks,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
      }}
    >
      {children}
    </KanbanContext.Provider>
  )
}

export const useKanban = () => {
  const context = useContext(KanbanContext)
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider')
  }
  return context
} 