import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  KeyboardSensor,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

import { KanbanColumn } from './components/kanban-column'
import { KanbanSearch } from './components/kanban-search'
import { KanbanFilters } from './components/kanban-filters'
import { useKanban } from './context/kanban-context'
import { columns } from './data/mock'
import { KanbanTask, Status } from '@/types/kanban'
import { KanbanTaskCard } from './components/kanban-task-card'
import { coordinateGetter } from './utils/keyboard-preset'
import { Search } from '@/components/search'

function KanbanFeature() {
  const { tasks, setTasks, searchQuery, filterStatus, filterPriority } = useKanban()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeColumn, setActiveColumn] = useState<{id: string, title: string} | null>(null)
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 50
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter
    })
  )

  const findContainer = (id: string) => {
    if (columns.find(col => col.id === id)) {
      return id
    }

    const task = tasks.find(task => task.id === id)
    return task ? task.status : null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string
    
    setActiveId(activeId)
    
    const activeType = active.data.current?.type
    if (activeType === 'Column') {
      const column = columns.find(col => col.id === activeId)
      if (column) {
        setActiveColumn({ id: column.id, title: column.title })
      }
    } else {
      const task = tasks.find(t => t.id === activeId)
      if (task) {
        setActiveTask(task)
      }
    }
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

    // Moving task to a different container
    const activeIndex = tasks.findIndex(t => t.id === activeId)
    if (activeIndex === -1) return

    const updatedTasks = [...tasks]
    const task = { ...updatedTasks[activeIndex], status: overContainer as Status }
    updatedTasks.splice(activeIndex, 1)
    
    // Find all tasks in the target container
    const tasksInContainer = tasks.filter(t => t.status === overContainer)
    
    if (tasksInContainer.length === 0) {
      // If container is empty, just add the task
      updatedTasks.push(task)
    } else {
      // Find the first task in the container and insert before it
      const firstTaskIndex = updatedTasks.findIndex(t => t.status === overContainer)
      if (firstTaskIndex === -1) {
        updatedTasks.push(task)
      } else {
        updatedTasks.splice(firstTaskIndex, 0, task)
      }
    }

    setTasks(updatedTasks)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveId(null)
    setActiveColumn(null)
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    // Moving columns
    if (active.data.current?.type === 'Column') {
      return // We don't move columns
    }

    // Moving to a different container
    if (activeContainer !== overContainer) {
      const activeIndex = tasks.findIndex(t => t.id === activeId)
      if (activeIndex === -1) return

      const updatedTasks = [...tasks]
      const task = { ...updatedTasks[activeIndex], status: overContainer as Status }
      updatedTasks.splice(activeIndex, 1)
      
      // Find all tasks in the target container
      const tasksInContainer = tasks.filter(t => t.status === overContainer)
      
      if (tasksInContainer.length === 0) {
        // If container is empty, just add the task
        updatedTasks.push(task)
      } else {
        // If dropping on a specific task, insert at that position
        if (overId !== overContainer) {
          const overIndex = updatedTasks.findIndex(t => t.id === overId)
          if (overIndex !== -1) {
            updatedTasks.splice(overIndex, 0, task)
          } else {
            updatedTasks.push(task)
          }
        } else {
          // If dropping on the container, add to the beginning
          const firstTaskIndex = updatedTasks.findIndex(t => t.status === overContainer)
          if (firstTaskIndex === -1) {
            updatedTasks.push(task)
          } else {
            updatedTasks.splice(firstTaskIndex, 0, task)
          }
        }
      }

      setTasks(updatedTasks)
    }
    // Same container, different position
    else if (activeId !== overId) {
      const oldIndex = tasks.findIndex(t => t.id === activeId)
      const newIndex = tasks.findIndex(t => t.id === overId)
      if (oldIndex !== -1 && newIndex !== -1) {
        setTasks(arrayMove(tasks, oldIndex, newIndex))
      }
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setActiveColumn(null)
    setActiveTask(null)
  }

  const filteredTasks = tasks.filter((task: KanbanTask) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(task.status)
    const matchesPriority = filterPriority.length === 0 || filterPriority.includes(task.priority)
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Kanban Board</h2>
            <p className='text-muted-foreground'>
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

        <div className="flex items-center space-x-2 mb-4">
          <KanbanSearch />
          <KanbanFilters />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div 
            className="flex gap-4 overflow-x-auto pb-4" 
            style={{ 
              scrollBehavior: 'smooth',
              minHeight: '500px',
            }}
          >
            <SortableContext items={columns.map(col => col.id)}>
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  tasks={filteredTasks.filter((task) => task.status === column.id)}
                  isOver={activeId ? column.id === activeId : false}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeColumn && (
              <KanbanColumn
                id={activeColumn.id}
                title={activeColumn.title}
                tasks={filteredTasks.filter((task) => task.status === activeColumn.id)}
                isOver={false}
                isOverlay
              />
            )}
            {activeTask && (
              <KanbanTaskCard task={activeTask} />
            )}
          </DragOverlay>
        </DndContext>
      </Main>
    </>
  )
}

export default KanbanFeature 