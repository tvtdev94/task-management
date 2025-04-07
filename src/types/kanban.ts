export interface KanbanTask {
  id: string
  title: string
  description?: string
  status: 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled'
  priority: 'low' | 'medium' | 'high'
  assignee?: {
    name: string
    avatar: string
  }
  dueDate?: string
  labels?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  tasks: KanbanTask[]
  isOver?: boolean
} 