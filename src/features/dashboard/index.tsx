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
import { fetchStaffData} from '@/api/userApi'
import { fetchUserProfile } from '@/api/userApi'
import { MonthlySavingsChart } from './components/lineChartforSavings'
import { SavingsGrowthChart } from './components/savingsGrowthOverTime'
import { SavingsProjectionChart } from './components/savingsProjectionsNY'
import { YearlySummaryChart } from './components/yearlySummaryChart'
import { ContributionAnalysisChart } from './components/contributionAnalysisChart'
import { CumulativeSavingsProjection } from './components/cumulativeSavingsProjection'

export default function Dashboard() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [withdrawal, setWithdrawal] = useState(0);
  const [carryForwardBalance, setCarryForwardBalance] = useState(0);
  const [balanceAfterInterest, setBalanceAfterInterest] = useState(0);
  const [interestPaid, setInterestPaid] = useState<number | null>(null); 
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData();

        console.log(data)

        if (data) {
          const total = data.total;
          setTotal(total);
          setCarryForwardBalance(data.carryForwardBalance || 0)
          setWithdrawal(data.withdrawal);
          setBalanceAfterInterest(data.balanceAfterInterest || 0)
          setInterestPaid(data.interestPaid)
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    // Fetch the interest rate
    // const fetchInterestRate = async () => {
    //   try {
    //     const interestData = await getInterest(); // Fetch interest rate
    //     if (interestData && interestData.interest) {
    //       setInterestPaid(); // Update state
    //     }
    //   } catch (error) {
    //     console.error('Error fetching interest rate:', error);
    //   }
    // };

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
    // fetchInterestRate(); // Fetch interest rate on mount
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
                  <div className='text-2xl font-bold'>₵{total.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>Yearly Total Contribution.</p>
                </CardContent>
              </Card>

              {/* Partial Withdrawal */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>₵{withdrawal.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>A Total Of Your Withdrawals</p>
                </CardContent>
              </Card>

              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Balance Brought Forward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>₵{carryForwardBalance.toFixed(2)}</div>
                  <p className='text-xs text-muted-foreground'>Your Balance From The Previous Year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Balance After Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                  ₵{balanceAfterInterest !== null ? `${balanceAfterInterest.toFixed(2)}` : 'Loading...'}
                  </div>
                  <p className='text-xs text-muted-foreground'>Addition Of Your Balance And Your Interest</p>
                </CardContent>
              </Card>

              {/* Interest Rate */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'># Interest Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {interestPaid !== null ? `₵${interestPaid}` : 'Loading...'}
                  </div>
                  <p className='text-xs text-muted-foreground'>Interest Paid</p>
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