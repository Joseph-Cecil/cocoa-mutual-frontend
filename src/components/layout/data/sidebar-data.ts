import {
  IconCashBanknote,
  // IconChartArea,
  // IconChecklist,
  IconLayoutDashboard,
  IconManualGearbox,
  IconReportAnalytics,
  IconSettings,
  IconTool,
  IconUpload,
  IconUserCog,
  IconUsersGroup,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Kobbie',
    email: 'kobbie@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Cocoa Mutual',
      plan: 'CHED Cocoa Mutual Web Application',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Report',
          url: '/report',
          icon: IconReportAnalytics,
        },
      ],
    },

     {
      title: 'Administrator',
      items: [
        {
          title: 'Manage Application',
          icon: IconManualGearbox,
          items: [
            {
              title: 'Manage Staff',
              url: '/admin',
              icon: IconUsersGroup,
            },
            {
              title: 'Upload Data',
              url: '/upload-excel',
              icon: IconUpload,
            },
            {
              title: 'Staff Contributions',
              url: '/contribution-dashboard',
              icon: IconCashBanknote,
            },
            // {
            //   title: 'Analytics',
            //   url: '/admin-dashboard',
            //   icon: IconChartArea,
            // }
        
          ],
        },
        
      ],
    },
    {
      title: 'Other',
      items: [
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
              title: 'Change Password',
              url: '/settings/account',
              icon: IconTool,
            },
            // {
            //   title: 'Appearance',
            //   url: '/settings/appearance',
            //   icon: IconPalette,
            // },
            // {
            //   title: 'Notifications',
            //   url: '/settings/notifications',
            //   icon: IconNotification,
            // },
        
          ],
        },
        
      ],
    },
  ],
}