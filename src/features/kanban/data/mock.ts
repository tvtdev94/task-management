import { KanbanTask } from '@/types/kanban'

export const defaultTasks: KanbanTask[] = [
  {
    id: '1',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for homepage and product pages',
    status: 'todo',
    priority: 'high',
    assignee: {
      name: 'Alex Nguyen',
      avatar: '/avatars/01.png'
    },
    dueDate: '2024-04-15',
    labels: ['design', 'ui/ux']
  },
  {
    id: '2',
    title: 'Optimize Application Performance',
    description: 'Analyze and improve page load times, optimize database queries',
    status: 'todo',
    priority: 'medium',
    assignee: {
      name: 'John Smith',
      avatar: '/avatars/02.png'
    },
    dueDate: '2024-04-20',
    labels: ['performance', 'optimization']
  },
  {
    id: '3',
    title: 'Write API Documentation',
    description: 'Create detailed documentation for all API endpoints',
    status: 'in_progress',
    priority: 'medium',
    assignee: {
      name: 'Sarah Johnson',
      avatar: '/avatars/03.png'
    },
    dueDate: '2024-04-18',
    labels: ['documentation', 'api']
  },
  {
    id: '4',
    title: 'Fix Login Issues',
    description: 'Resolve user login problems after password reset',
    status: 'in_progress',
    priority: 'high',
    assignee: {
      name: 'Mike Wilson',
      avatar: '/avatars/04.png'
    },
    dueDate: '2024-04-12',
    labels: ['bug', 'authentication']
  },
  {
    id: '5',
    title: 'Integrate Payment System',
    description: 'Integrate Stripe for payment processing in the application',
    status: 'done',
    priority: 'high',
    assignee: {
      name: 'Emily Davis',
      avatar: '/avatars/05.png'
    },
    dueDate: '2024-04-10',
    labels: ['payment', 'integration']
  },
  {
    id: '6',
    title: 'Security Testing',
    description: 'Perform security checks and penetration testing',
    status: 'done',
    priority: 'high',
    assignee: {
      name: 'David Brown',
      avatar: '/avatars/06.png'
    },
    dueDate: '2024-04-08',
    labels: ['security', 'testing']
  },
  {
    id: '7',
    title: 'Design Email Templates',
    description: 'Create email templates for notifications and marketing',
    status: 'todo',
    priority: 'low',
    assignee: {
      name: 'Lisa Anderson',
      avatar: '/avatars/07.png'
    },
    dueDate: '2024-04-25',
    labels: ['design', 'email']
  },
  {
    id: '8',
    title: 'Update Dependencies',
    description: 'Update all packages to their latest versions',
    status: 'in_progress',
    priority: 'low',
    assignee: {
      name: 'Tom Harris',
      avatar: '/avatars/08.png'
    },
    dueDate: '2024-04-22',
    labels: ['maintenance']
  }
]

export const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
  { id: 'canceled', title: 'Canceled' },
] 