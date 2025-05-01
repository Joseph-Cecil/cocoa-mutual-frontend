import { IconPencil, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useUsers } from '../context/users-context'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1 text-black dark:text-[whitesmoke]" 
        onClick={() => setOpen('invite')}
      >
        <span>Set Interest</span> <IconPencil size={18} />
      </Button>
      <Button className="space-x-1 text-white dark:text-[whitesmoke]" onClick={() => setOpen('add')}>
        <span>Register Staff</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
