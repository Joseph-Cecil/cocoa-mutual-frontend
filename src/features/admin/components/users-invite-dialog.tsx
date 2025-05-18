import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconSend } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { setInterest } from '../../../api/adminApi'
import { Input } from '@/components/ui/input'

// Form schema
const formSchema = z.object({
  interest: z
    .number({
      invalid_type_error: 'Interest must be a number.',
    })
    .min(1, { message: 'New interest rate is required.' }),
})

// Props interface
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { interest: 1 },
  })

  const onSubmit = async (values: { interest: number }) => {
    setLoading(true)

    try {
      await setInterest(values.interest) // Ensure it's a number

      toast({
        title: 'Success!',
        description: 'Interest rate updated successfully.',
      })

      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: error as string,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>

        <Form {...form}>
          <form
            id='user-invite-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='interest'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Interest</FormLabel>
                  <Input
                    type="number" // Ensures numeric input
                    value={field.value} // Ensures controlled input
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // Convert input to number
                    placeholder='Enter Interest Rate'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button className="space-x-1 text-black dark:text-[whitesmoke]" variant='outline' disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button className="space-x-1 text-black dark:text-[whitesmoke]" type='submit' form='user-invite-form' disabled={loading}>
            {loading ? 'Saving...' : 'Set Interest'} <IconSend />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
