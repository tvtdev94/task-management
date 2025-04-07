import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanTask } from '@/types/kanban'
import { cn } from '@/lib/utils'

interface KanbanTaskCardProps {
  task: KanbanTask
}

export function KanbanTaskCard({ task }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    over,
    active
  } = useSortable({
    id: task.id,
    transition: {
      duration: 150, // ms
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative rounded-lg border bg-card p-3 shadow-sm transition-colors",
        isDragging && "opacity-50 cursor-grabbing shadow-lg scale-105",
        !isDragging && "cursor-grab hover:border-primary/50",
        isSorting && "transition-transform"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{task.title}</span>
          {task.priority && (
            <span className={`text-xs font-medium ${
              task.priority === 'high' 
                ? 'text-red-500' 
                : task.priority === 'medium'
                ? 'text-yellow-500'
                : 'text-green-500'
            }`}>
              {task.priority}
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        <div className="flex items-center space-x-4">
          {task.assignee && (
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {getInitials(task.assignee.name)}
              </div>
              <span className="text-xs text-muted-foreground">
                {task.assignee.name}
              </span>
            </div>
          )}
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 