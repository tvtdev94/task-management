import { PlusCircledIcon, Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useKanban } from '../context/kanban-context'
import { columns } from '../data/mock'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function KanbanFilters() {
  const { 
    tasks,
    filterStatus, 
    setFilterStatus,
    filterPriority,
    setFilterPriority 
  } = useKanban()

  const getTaskCountByStatus = (status: string) => {
    return tasks.filter(task => status === 'all' ? true : task.status === status).length
  }

  const getTaskCountByPriority = (priority: string) => {
    return tasks.filter(task => priority === 'all' ? true : task.priority === priority).length
  }

  const handleReset = () => {
    setFilterStatus([])
    setFilterPriority([])
  }

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      setFilterStatus([])
      return
    }
    
    const isSelected = filterStatus.includes(status)
    if (isSelected) {
      setFilterStatus(filterStatus.filter(s => s !== status))
    } else {
      setFilterStatus([...filterStatus, status])
    }
  }

  const handlePriorityChange = (priority: string) => {
    if (priority === 'all') {
      setFilterPriority([])
      return
    }
    
    const isSelected = filterPriority.includes(priority)
    if (isSelected) {
      setFilterPriority(filterPriority.filter(p => p !== priority))
    } else {
      setFilterPriority([...filterPriority, priority])
    }
  }

  const getStatusTitle = (status: string) => {
    const column = columns.find(col => col.id === status)
    return column?.title
  }

  const getPriorityTitle = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs border-dashed [&_svg]:size-4 [&_svg]:shrink-0"
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Status
            {filterStatus.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="flex gap-1">
                  {filterStatus.map(status => (
                    <Badge key={status} variant="secondary" className="rounded-md">
                      {getStatusTitle(status)}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="space-y-2 p-2">
            <div className="flex items-center space-x-2 px-2 py-1">
              <Checkbox 
                id="status-all"
                checked={filterStatus.length === 0}
                onCheckedChange={() => handleStatusChange('all')}
              />
              <label htmlFor="status-all" className="flex-1 text-sm font-medium">
                All Status
              </label>
              <span className="text-muted-foreground text-sm">{getTaskCountByStatus('all')}</span>
            </div>
            {columns.map(column => (
              <div key={column.id} className="flex items-center space-x-2 px-2 py-1">
                <Checkbox 
                  id={`status-${column.id}`}
                  checked={filterStatus.includes(column.id)}
                  onCheckedChange={() => handleStatusChange(column.id)}
                />
                <label htmlFor={`status-${column.id}`} className="flex-1 text-sm font-medium">
                  {column.title}
                </label>
                <span className="text-muted-foreground text-sm">{getTaskCountByStatus(column.id)}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs border-dashed [&_svg]:size-4 [&_svg]:shrink-0"
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Priority
            {filterPriority.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="flex gap-1">
                  {filterPriority.map(priority => (
                    <Badge key={priority} variant="secondary" className="rounded-md">
                      {getPriorityTitle(priority)}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="space-y-2 p-2">
            <div className="flex items-center space-x-2 px-2 py-1">
              <Checkbox 
                id="priority-all"
                checked={filterPriority.length === 0}
                onCheckedChange={() => handlePriorityChange('all')}
              />
              <label htmlFor="priority-all" className="flex-1 text-sm font-medium">
                All Priority
              </label>
              <span className="text-muted-foreground text-sm">{getTaskCountByPriority('all')}</span>
            </div>
            {['low', 'medium', 'high'].map(priority => (
              <div key={priority} className="flex items-center space-x-2 px-2 py-1">
                <Checkbox 
                  id={`priority-${priority}`}
                  checked={filterPriority.includes(priority)}
                  onCheckedChange={() => handlePriorityChange(priority)}
                />
                <label htmlFor={`priority-${priority}`} className="flex-1 text-sm font-medium capitalize">
                  {priority}
                </label>
                <span className="text-muted-foreground text-sm">{getTaskCountByPriority(priority)}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {(filterStatus.length > 0 || filterPriority.length > 0) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 lg:px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 