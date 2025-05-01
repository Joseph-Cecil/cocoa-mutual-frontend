export type DatabaseSchema = {
    id: string; // Unique identifier
    userId: string; // User ID for the activity
    type: 'loan' | 'contribution' | 'payment'; // Activity type
    description: string; // Activity description
    amount: number; // Amount involved
    date: string; // Date of the activity
  };
  