/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { MonthlySavingsChart } from './components/lineChartforSavings'
import { SavingsGrowthChart } from './components/savingsGrowthOverTime'
import { SavingsProjectionChart } from './components/savingsProjectionsNY'
import { YearlySummaryChart } from './components/yearlySummaryChart'
import { ContributionAnalysisChart } from './components/contributionAnalysisChart'
import { CumulativeSavingsProjection } from './components/cumulativeSavingsProjection'

export default function Dashboard() {
  const navigate = useNavigate();
  const [totalContributions, setTotalContributions] = useState(0);
  const [partialWithdrawal, setPartialWithdrawal] = useState(0);
  const [depositTopUp, setDepositTopUp] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [interestRate, setInterestRate] = useState<number | null>(null); 
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData();

        if (data && data.contributions) {
          const total = data.contribution.total;
          setTotalContributions(total);
          setTotalBalance(data.balanceForTheYear || 0)
          setPartialWithdrawal(total * 0.5);
          setDepositTopUp(data.topUpDeposit || 0)
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
          <div className="flex flex-wrap items-center space-x-2 sm:flex-nowrap">
            <Button style={{ color: 'whitesmoke' }} onClick={() => navigate({ to: "/report" })}>
              Go To Reports
            </Button>
          </div>
        </div>

        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5'>

              {/* Total Contributions */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Total Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>₵{totalContributions.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>Yearly Total Contribution.</p>
                </CardContent>
              </Card>

              {/* Partial Withdrawal */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>₵{partialWithdrawal.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>50% of Total Contributions</p>
                </CardContent>
              </Card>

              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>₵{totalBalance.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>Total Amount Contributed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Deposit Top Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                  ₵{depositTopUp !== null ? `${depositTopUp.toFixed(2)}` : 'Loading...'}
                  </div>
                  <p className='text-xs text-muted-foreground'>Deposit Top Up</p>
                </CardContent>
              </Card>

              {/* Interest Rate */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Interest Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {interestRate !== null ? `${interestRate}%` : 'Loading...'}
                  </div>
                  <p className='text-xs text-muted-foreground'>Current Interest Rate</p>
                </CardContent>
              </Card>

            </div>

            {/* Monthly Contributions & Transaction History */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
             <MonthlySavingsChart/>
              <SavingsGrowthChart/>
              <SavingsProjectionChart/>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <YearlySummaryChart/>
              <ContributionAnalysisChart/>
            </div>

            <div className='grid grid-cols-1'>
              <CumulativeSavingsProjection/>
            </div>
            
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}