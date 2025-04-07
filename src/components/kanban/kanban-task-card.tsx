import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { KanbanTask } from '@/types/kanban'

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-red-100 text-red-800',
}

export function KanbanTaskCard({
  id,
  title,
  description,
  priority,
  assignee,
  dueDate,
  labels,
}: KanbanTask) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab space-y-3 rounded-md bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Badge variant="outline" className={cn(priorityColors[priority])}>
          {priority}
        </Badge>
      </div>

      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {labels && labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {labels.map((label) => (
            <Badge key={label} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {assignee && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>
                {assignee.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{assignee.name}</span>
          </div>
        )}

        {dueDate && (
          <span className="text-xs text-gray-500">
            {format(new Date(dueDate), 'dd MMM', { locale: vi })}
          </span>
        )}
      </div>
    </div>
  )
} 