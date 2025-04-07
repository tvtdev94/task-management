import { Input } from '@/components/ui/input'
import { useKanban } from '../context/kanban-context'

export function KanbanSearch() {
  const { searchQuery, setSearchQuery } = useKanban()

  return (
    <div className="relative w-[150px] lg:w-[250px]">
      <Input
        placeholder="Filter tasks..."
        className="h-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
} 