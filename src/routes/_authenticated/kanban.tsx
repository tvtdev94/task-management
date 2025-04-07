import { createFileRoute } from '@tanstack/react-router'
import { KanbanFeature } from '@/features/kanban'

export const Route = createFileRoute('/_authenticated/kanban')({
  component: KanbanPage,
})

function KanbanPage() {
  return <KanbanFeature />
} 