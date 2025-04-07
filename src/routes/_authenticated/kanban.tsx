import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/kanban')({
  component: KanbanPage,
})

function KanbanPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      {/* Kanban board content will be added here */}
    </div>
  )
} 