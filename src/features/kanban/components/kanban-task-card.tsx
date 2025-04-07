import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanTask } from '@/types/kanban'

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
    isDragging
  } = useSortable({
    id: task.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg border bg-card p-3 shadow-sm"
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
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="h-6 w-6 rounded-full"
              />
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