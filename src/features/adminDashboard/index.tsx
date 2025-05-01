/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useNavigate } from '@tanstack/react-router'
import { fetchStaffData, getInterest } from '@/api/userApi'
import { fetchUserProfile } from '@/api/userApi'
import { Charts } from './components/charts'
import { BarChartLabel } from './components/barChartLabel'
import { BarChartMixed } from './components/barChartMixed'
import { PieChartInteractive } from './components/pieChartInteractive'
import { MonthlyUserDeposits } from './components/monthlyUserDeposits'

export default function Dashboard() {
  const navigate = useNavigate();
  const [totalContributions, setTotalContributions] = useState(0);
  const [partialWithdrawal, setPartialWithdrawal] = useState(0);
  const [loanAccess, setLoanAccess] = useState(0);
  const [interestRate, setInterestRate] = useState<number | null>(null); // New state for interest rate
  const [isAdmin, setIsAdmin] = useState(false); // State for admin status


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData();

        if (data && data.contributions) {
          const total = data.totalContribution;
          setTotalContributions(total);
          setPartialWithdrawal(total * 0.5); // 50% of contributions
          setLoanAccess(total * 5); // 5 times total contributions
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    // Fetch the interest rate
    const fetchInterestRate = async () => {
      try {
        const interestData = await getInterest(); // Fetch interest rate
        if (interestData && interestData.interest) {
          setInterestRate(interestData.interest); // Update state
        }
      } catch (error) {
        console.error('Error fetching interest rate:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        if (profile && profile.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchProfile();
    fetchData();
    fetchInterestRate(); // Fetch interest rate on mount
  }, []);

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 -mt-7 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{isAdmin ? "Admin Dashboard" : "Staff Dashboard"}</h1>
        </div>

        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            

              {/* Total Contributions */}
              <Card>
                <PieChartInteractive/>
              </Card>

              {/* Partial Withdrawal */}
              <Card>
                <Charts/>
              </Card>

              {/* Loan Access */}
              <Card>
                <BarChartLabel/>
              </Card>

              {/* Interest Rate */}
              <Card>
               <BarChartMixed/>
              </Card>

            </div>

            {/* Monthly Contributions & Transaction History */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-7'>
                <MonthlyUserDeposits/>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}