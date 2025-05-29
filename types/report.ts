export interface DatabaseSchema {
  id: string;
  userId: string;
  date: string;
  description: string;
  monthly: number;
  interestPaid: number;
  withdrawal: number;
  balanceAfterInterest: number;
}