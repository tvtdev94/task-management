import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanTask } from '@/types/kanban'
import { KanbanTaskCard } from './kanban-task-card'

interface KanbanColumnProps {
  id: string
  title: string
  tasks: KanbanTask[]
  isOver: boolean
}

export function KanbanColumn({ id, title, tasks, isOver }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id
  })

  return (
    <div 
      ref={setNodeRef}
      className={`flex h-full w-[350px] shrink-0 flex-col rounded-lg bg-muted/50 p-2 ${isOver ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center justify-between p-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
} 