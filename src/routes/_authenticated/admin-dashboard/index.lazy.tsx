import { createLazyFileRoute } from '@tanstack/react-router'
import AdminDashboard from '@/features/adminDashboard'

export const Route = createLazyFileRoute('/_authenticated/admin-dashboard/')({
  component: AdminDashboard,
})
