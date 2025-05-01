import { createLazyFileRoute } from '@tanstack/react-router'
import Report from '@/features/report'

export const Route = createLazyFileRoute('/_authenticated/report/')({
  component: Report,
})
