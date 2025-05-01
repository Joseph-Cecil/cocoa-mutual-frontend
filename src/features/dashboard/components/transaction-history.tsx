import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchStaffData } from '@/api/userApi';

interface Contribution {
  month: string;
  amount: number;
}

export function RecentSales() {
  const [transactions, setTransactions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await fetchStaffData();
        // eslint-disable-next-line no-console
        console.log('Fetched Data:', data); 

        if (data && data.contributions && typeof data.contributions === 'object') {
          const contributionsArray = Object.entries(data.contributions).map(([month, amount]) => ({
            month,
            amount: Number(amount),
          }));

          // Get last three months
          const recentContributions = contributionsArray.slice(-3).reverse();
          setTransactions(recentContributions);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Loading contributions...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className='space-y-8'>
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => {
          // Get first three letters of the month for the avatar fallback
          const monthShort = transaction.month.slice(0, 3).toUpperCase();

          return (
            <div key={transaction.month} className='flex items-center gap-4'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={`/avatars/0${index + 1}.png`} alt='Avatar' />
                <AvatarFallback>{monthShort}</AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-wrap items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium leading-none'>{transaction.month} 2024</p>
                  <p className='text-sm text-muted-foreground'>
                    You paid ₵{transaction.amount.toFixed(2)} as a contribution for the month of{' '}
                    {transaction.month}.
                  </p>
                </div>
                <div className='font-medium'>+₵{transaction.amount.toFixed(2)}</div>
              </div>
            </div>
          );
        })
      ) : (
        <p className='text-sm text-muted-foreground'>No recent contributions found.</p>
      )}
    </div>
  );
}
