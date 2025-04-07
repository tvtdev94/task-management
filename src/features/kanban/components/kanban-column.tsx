import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanTask } from '@/types/kanban'
import { KanbanTaskCard } from './kanban-task-card'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  tasks: KanbanTask[]
  isOver: boolean
  isOverlay?: boolean
}

export function KanbanColumn({ id, title, tasks, isOver, isOverlay }: KanbanColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'Column',
      column: { id, title }
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex h-full w-[350px] shrink-0 flex-col rounded-lg bg-muted/50 p-2 transition-colors",
        isOverlay && "ring-2 ring-primary shadow-lg",
        isDragging && "opacity-50",
        !isOverlay && !isDragging && isOver && "ring-2 ring-primary/50 bg-muted/80"
      )}
    >
      <div className="flex items-center justify-between p-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {tasks.length}
        </span>
      </div>
      <div className={cn(
        "flex-1 space-y-2 overflow-y-auto p-2",
        tasks.length === 0 && "min-h-[200px]",
        isOver && !isDragging && "bg-muted/30 rounded-lg transition-colors duration-200"
      )}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
} 