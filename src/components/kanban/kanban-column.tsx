import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { KanbanTask } from '@/types/kanban'
import { KanbanTaskCard } from './kanban-task-card'

interface KanbanColumnProps {
  id: string
  title: string
  tasks: KanbanTask[]
  isOver?: boolean
}

export function KanbanColumn({ id, title, tasks, isOver }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-[calc(100vh-12rem)] w-[350px] shrink-0 flex-col rounded-lg bg-gray-100 p-4',
        isOver && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} {...task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
} 