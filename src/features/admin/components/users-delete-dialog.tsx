import { useState } from "react";
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { User } from '../data/schema';
import { deleteUser } from "../../../api/adminApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
  refetchUsers: () => void; // Add refetchUsers to refresh user list after deletion
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState(0);

  const handleDelete = async () => {
    if (value !== currentRow.staffId) return;

    try {
      // Delete the user by calling the deleteUser API function
      if (currentRow._id) {
        await deleteUser(currentRow._id);
      } else {
        throw new Error("User ID is undefined");
      }
      
      // Close the dialog
      onOpenChange(false);

      toast.success("Staff Deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch (error) {
      // Handle error
      // eslint-disable-next-line no-console
      console.log(error);
        toast.error("Failed to delete Staff.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    }
  };

  return (
    <><ToastContainer />
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value !== currentRow.staffId}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.firstName} {currentRow.lastName}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Staff ID:
            <Input
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder='Enter staff ID to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    /></>
  );
}
