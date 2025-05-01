import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { fetchUserProfile } from '@/api/userApi';
import { Skeleton } from '@/components/ui/skeleton'

type ProfileData = {
  staffId: string;
  firstName: string;
  lastName: string;
  role: string;
  dob: string;
  language: string;
};

const accountFormSchema = z.object({
  staffId: z.string().min(1, { message: "Please enter your staff Id" }),
  firstName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  language: z.string({
    required_error: 'Please select a language.',
  }),
})


// // This can come from your database or API.
// const defaultValues: Partial<AccountFormValues> = {
//   name: '',
// }

export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    
  });

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch and populate profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfileData(data);
        // eslint-disable-next-line no-console
        console.log(profileData)

        // Populate form with profile data
        form.setValue("StaffId", data.staffId || "");
        form.setValue("firstName", data.firstName || "");
        form.setValue("lastName", data.lastName || "");
        form.setValue("dob", data.dob ? new Date(data.dob) : new Date()); // If dob exists, convert it to Date object, otherwise use current date
        form.setValue("role", data.role || "");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [form, profileData]);

  if (loading) {
    return <div className="space-y-8">
    {/* Staff ID Skeleton */}
    <div>
      <div className="mb-2 h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <Skeleton className="h-10 w-full" />
    </div>
    {/* First Name Skeleton */}
    <div>
      <div className="mb-2 h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <Skeleton className="h-10 w-full" />
    </div>
    {/* Last Name Skeleton */}
    <div>
      <div className="mb-2 h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <Skeleton className="h-10 w-full" />
    </div>
    {/* Role Skeleton */}
    <div>
      <div className="mb-2 h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <Skeleton className="h-10 w-full" />
    </div>
  </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }



  return (
    <Form {...form}>
      <form className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="staffId"
          render={() => (
            <FormItem>
              <FormLabel>Staff Id</FormLabel>
              <FormControl>
                <Input placeholder="Staff Id" value={profileData?.staffId} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
   

     

       
      </form>
    </Form>
  );
}
