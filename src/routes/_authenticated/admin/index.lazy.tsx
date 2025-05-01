import { createLazyFileRoute } from '@tanstack/react-router'
import Admin from '@/features/admin'

export const Route = createLazyFileRoute('/_authenticated/admin/')({
  component: Admin,
})
