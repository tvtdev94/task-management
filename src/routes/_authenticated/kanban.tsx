import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KanbanColumn } from '@/components/kanban/kanban-column'
import { KanbanTask } from '@/types/kanban'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/kanban')({
  component: KanbanPage,
})

const defaultTasks: KanbanTask[] = [
  {
    id: '1',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for homepage and product pages',
    status: 'todo',
    priority: 'high',
    assignee: {
      name: 'Alex Nguyen',
      avatar: '/avatars/01.png'
    },
    dueDate: '2024-04-15',
    labels: ['design', 'ui/ux']
  },
  {
    id: '2',
    title: 'Optimize Application Performance',
    description: 'Analyze and improve page load times, optimize database queries',
    status: 'todo',
    priority: 'medium',
    assignee: {
      name: 'John Smith',
      avatar: '/avatars/02.png'
    },
    dueDate: '2024-04-20',
    labels: ['performance', 'optimization']
  },
  {
    id: '3',
    title: 'Write API Documentation',
    description: 'Create detailed documentation for all API endpoints',
    status: 'in_progress',
    priority: 'medium',
    assignee: {
      name: 'Sarah Johnson',
      avatar: '/avatars/03.png'
    },
    dueDate: '2024-04-18',
    labels: ['documentation', 'api']
  },
  {
    id: '4',
    title: 'Fix Login Issues',
    description: 'Resolve user login problems after password reset',
    status: 'in_progress',
    priority: 'high',
    assignee: {
      name: 'Mike Wilson',
      avatar: '/avatars/04.png'
    },
    dueDate: '2024-04-12',
    labels: ['bug', 'authentication']
  },
  {
    id: '5',
    title: 'Integrate Payment System',
    description: 'Integrate Stripe for payment processing in the application',
    status: 'done',
    priority: 'high',
    assignee: {
      name: 'Emily Davis',
      avatar: '/avatars/05.png'
    },
    dueDate: '2024-04-10',
    labels: ['payment', 'integration']
  },
  {
    id: '6',
    title: 'Security Testing',
    description: 'Perform security checks and penetration testing',
    status: 'done',
    priority: 'high',
    assignee: {
      name: 'David Brown',
      avatar: '/avatars/06.png'
    },
    dueDate: '2024-04-08',
    labels: ['security', 'testing']
  },
  {
    id: '7',
    title: 'Design Email Templates',
    description: 'Create email templates for notifications and marketing',
    status: 'todo',
    priority: 'low',
    assignee: {
      name: 'Lisa Anderson',
      avatar: '/avatars/07.png'
    },
    dueDate: '2024-04-25',
    labels: ['design', 'email']
  },
  {
    id: '8',
    title: 'Update Dependencies',
    description: 'Update all packages to their latest versions',
    status: 'in_progress',
    priority: 'low',
    assignee: {
      name: 'Tom Harris',
      avatar: '/avatars/08.png'
    },
    dueDate: '2024-04-22',
    labels: ['maintenance']
  }
]

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
  { id: 'canceled', title: 'Canceled' },
]

function KanbanPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>(defaultTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const findContainer = (id: string) => {
    if (columns.find((col) => col.id === id)) {
      return id
    }

    const task = tasks.find((task) => task.id === id)
    return task?.status
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    setTasks((prev) => {
      const activeItems = prev.filter((item) => item.status === activeContainer)
      const overItems = prev.filter((item) => item.status === overContainer)

      const activeIndex = activeItems.findIndex((item) => item.id === activeId)
      const overIndex = overItems.findIndex((item) => item.id === overId)

      let newIndex: number
      if (overId in prev) {
        newIndex = overItems.length + 1
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      return prev.map((task) =>
        task.id === activeId ? { ...task, status: overContainer } : task
      )
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    const activeIndex = tasks.findIndex((task) => task.id === activeId)
    const overIndex = tasks.findIndex((task) => task.id === overId)

    if (activeIndex !== overIndex) {
      setTasks((tasks) => arrayMove(tasks, activeIndex, overIndex))
    }

    if (activeContainer !== overContainer) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: overContainer } : task
        )
      )
    }
  }

  const getTaskCountByStatus = (status: string) => {
    return tasks.filter(task => status === 'all' ? true : task.status === status).length
  }

  const getTaskCountByPriority = (priority: string) => {
    return tasks.filter(task => priority === 'all' ? true : task.priority === priority).length
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kanban Board</h2>
          <p className="text-muted-foreground">
            Manage and track your project tasks
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter tasks..."
            className="h-8 w-[150px] lg:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>Status</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="space-y-2 p-2">
                <div className="flex items-center space-x-2 px-2 py-1">
                  <Checkbox 
                    id="status-all"
                    checked={filterStatus === 'all'}
                    onCheckedChange={() => setFilterStatus('all')}
                  />
                  <label htmlFor="status-all" className="flex-1 text-sm font-medium">
                    All Status
                  </label>
                  <span className="text-muted-foreground text-sm">{getTaskCountByStatus('all')}</span>
                </div>
                {columns.map(column => (
                  <div key={column.id} className="flex items-center space-x-2 px-2 py-1">
                    <Checkbox 
                      id={`status-${column.id}`}
                      checked={filterStatus === column.id}
                      onCheckedChange={() => setFilterStatus(column.id)}
                    />
                    <label htmlFor={`status-${column.id}`} className="flex-1 text-sm font-medium">
                      {column.title}
                    </label>
                    <span className="text-muted-foreground text-sm">{getTaskCountByStatus(column.id)}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>Priority</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="space-y-2 p-2">
                <div className="flex items-center space-x-2 px-2 py-1">
                  <Checkbox 
                    id="priority-all"
                    checked={filterPriority === 'all'}
                    onCheckedChange={() => setFilterPriority('all')}
                  />
                  <label htmlFor="priority-all" className="flex-1 text-sm font-medium">
                    All Priority
                  </label>
                  <span className="text-muted-foreground text-sm">{getTaskCountByPriority('all')}</span>
                </div>
                {['low', 'medium', 'high'].map(priority => (
                  <div key={priority} className="flex items-center space-x-2 px-2 py-1">
                    <Checkbox 
                      id={`priority-${priority}`}
                      checked={filterPriority === priority}
                      onCheckedChange={() => setFilterPriority(priority)}
                    />
                    <label htmlFor={`priority-${priority}`} className="flex-1 text-sm font-medium capitalize">
                      {priority}
                    </label>
                    <span className="text-muted-foreground text-sm">{getTaskCountByPriority(priority)}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={filteredTasks.filter((task) => task.status === column.id)}
              isOver={activeId ? column.id === activeId : false}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
} 