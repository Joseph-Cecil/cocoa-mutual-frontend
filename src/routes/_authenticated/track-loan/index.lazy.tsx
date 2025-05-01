import { createLazyFileRoute } from '@tanstack/react-router'
import Tasks from '@/features/track-loan'

export const Route = createLazyFileRoute('/_authenticated/track-loan/')({
  component: Tasks,
})
