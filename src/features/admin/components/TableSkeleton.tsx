import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function UsersTableSkeleton({ columns }: { columns: number }) {
  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(columns)].map((_, index) => (
                <TableHead key={index} className='h-10 bg-gray-200 animate-pulse'></TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className='animate-pulse'>
                {[...Array(columns)].map((_, colIndex) => (
                  <TableCell key={colIndex} className='h-10 bg-gray-100'></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
