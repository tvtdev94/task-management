import { createLazyFileRoute } from '@tanstack/react-router'
import KanbanFeature from '@/features/kanban'
import { KanbanProvider } from '@/features/kanban/context/kanban-context'

export const Route = createLazyFileRoute('/_authenticated/kanban/')({
  component: KanbanPage,
})

function KanbanPage() {
  return (
    <KanbanProvider>
      <KanbanFeature />
    </KanbanProvider>
  )
}