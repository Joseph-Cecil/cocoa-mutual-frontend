import UploadExcel from '@/features/uploadExcel'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/upload-excel/')({
  component: UploadExcel,
})
