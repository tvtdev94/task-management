import {
  IconChecklist,
  IconLayoutDashboard,
  IconNotification,
  IconSettings,
  IconUserCog,
  IconUsers,
  IconLayoutKanban,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'vudao@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  team: {
    name: 'Task Management',
    logo: Command,
  },
  navGroups: [
    {
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Kanban',
          url: '/kanban',
          icon: IconLayoutKanban,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
      ],
    },
  ],
}
