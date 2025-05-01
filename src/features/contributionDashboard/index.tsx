import { useEffect, useState } from "react";
import { getStaffData } from "../../api/adminApi";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ContributionDashboard() {
  interface Contribution {
    staffId: string;
    name: string;
    contributions: { [key: string]: number };
    totalContribution: number;
    topUpDeposit: number;
    partialWithdrawal?: number;
    balanceForTheYear?: number;
  }

  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStaffData();
        setContributions(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch staff data:", error);
      }
    };

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredContributions = contributions.filter(
    (contribution) =>
      contribution.staffId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      contribution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header>
      <input
  type="text"
  placeholder="Search by staff ID or name"
  className="h-8 w-full max-w-xs rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:border-muted dark:bg-muted/20 dark:placeholder:text-muted-foreground"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-7 -mt-3 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Staff Contributions</h1>
        </div>
        <Table>
          <TableCaption>Contribution Records for Staff</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Staff ID</TableHead>
              <TableHead>Staff Name</TableHead>
              {[
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ].map((month) => (
                <TableHead key={month}>{month}</TableHead>
              ))}
              <TableHead>Total Contribution</TableHead>
              <TableHead>Deposit - Top Up</TableHead>
              <TableHead>Partial Withdrawal</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContributions.length > 0 ? (
              filteredContributions.map((contribution, index) => (
                <TableRow key={index}>
                  <TableCell>{contribution.staffId}</TableCell>
                  <TableCell>{contribution.name}</TableCell>
                  {[
                    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
                  ].map((month, i) => (
                    <TableCell key={i}>{contribution.contributions[month] || 0}</TableCell>
                  ))}
                  <TableCell>{contribution.totalContribution}</TableCell>
                  <TableCell>{contribution.topUpDeposit}</TableCell>
                  <TableCell>{contribution.partialWithdrawal || "N/A"}</TableCell>
                  <TableCell>{contribution.balanceForTheYear || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={18} className="text-center">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Main>
    </>
  );
}
