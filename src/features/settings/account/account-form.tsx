import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { changePassword } from "@/api/authApi";
import { useNavigate } from "@tanstack/react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Schema for password change validation
const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Old password must be at least 6 characters." }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters." }),
    confirmNewPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters." }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmNewPassword"],
      });
    }
  });

export function AccountForm() {
  const navigate = useNavigate();
  const passwordForm = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    resolver: zodResolver(passwordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange: SubmitHandler<{
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }> = async (values) => {
    setIsLoading(true); 
    try {
      await changePassword(values.oldPassword, values.newPassword);

      

      passwordForm.reset();

      setTimeout(() => navigate({ to: "/" }), 1000);
      
      toast.success("Password changed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Show error toast
      toast.error("Failed to change password. Please check your old password.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      passwordForm.setError("oldPassword", {
        type: "manual",
        message: "Failed to change password. Please check your old password.",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="space-y-12">
      <ToastContainer />
      <Form {...passwordForm}>
        <form
          className="space-y-8"
          onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
        >
          <FormField
            control={passwordForm.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            style={{ color: "whitesmoke" }}
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
