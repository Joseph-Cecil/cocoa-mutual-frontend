import { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import TasksContextProvider, { TasksDialogType } from './context/tasks-context'
import { Task } from './data/schema'
import { tasks } from './data/tasks'

export default function Tasks() {
  // Local states
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [open, setOpen] = useDialogState<TasksDialogType>(null)

  return (
    <TasksContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {/* ===== Top Heading ===== */}
      <Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Track Loan</h2>
            <p className='text-muted-foreground'>
              Track All Your Loans
            </p>
          </div>
          
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasks} columns={columns} />
        </div>
      </Main>
    </TasksContextProvider>
  )
}
