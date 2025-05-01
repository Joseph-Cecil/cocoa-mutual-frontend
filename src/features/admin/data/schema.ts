import { z } from 'zod';

const userRoleSchema = z.union([
  z.literal('admin'),
  z.literal('staff'),
]);


const userSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  staffId: z.number({ required_error: "Staff ID is required" }),
  role: userRoleSchema,
  _id: z.string().optional(),
  staffData: z.any().nullable(), // Allow `null` values
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});


// Extend the schema with a transform to rename _id to id
export const userListSchema = z.array(
  userSchema.transform((data) => ({
    ...data,
    id: data._id ?? data.id,  // Preserve existing `id` if `_id` is missing
  }))
);


export type User = z.infer<typeof userSchema>;
