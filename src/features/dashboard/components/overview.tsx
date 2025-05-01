import { fetchStaffData } from '@/api/userApi'; 
import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const months = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const years = [2020, 2021, 2022, 2023, 2024, 2025]; // Available years

export function Overview() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [yearlyData, setYearlyData] = useState<Record<number, { name: string; total: number }[]>>({});
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const data = await fetchStaffData();

        // Process contributions per year
        const processedData: Record<number, { name: string; total: number }[]> = {};
        const validYears: number[] = [];

        years.forEach(year => {
          const contributions = data?.contributions || {};
          const transformedData = months.map(month => ({
            name: month.slice(0, 3), // Shortened Month (e.g., "JAN")
            total: contributions[month] || 0,
          }));

          if (transformedData.some(item => item.total > 0)) {
            processedData[year] = transformedData;
            validYears.push(year);
          }
        });

        setYearlyData(processedData);
        setAvailableYears(validYears);

        // Default to the latest year with data
        if (validYears.length > 0) {
          setSelectedYear(validYears[validYears.length - 1]);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load staff data.");
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, []);

  if (loading) return <p>Loading staff data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-start">
      {/* Chart */}
      <div className="flex-1 mt-5">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={yearlyData[selectedYear] || []}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₵${value}`}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Year Selector at Top Left */}
      <div className="sm:ml-4 mt-4 sm:mt-0 flex sm:flex-col sm:space-y-2 space-x-2 sm:space-x-0">
        {years.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            disabled={!availableYears.includes(year)} // Disable if year has no data
            className={`text-sm px-2 py-1 rounded-lg transition ${
              selectedYear === year
                ? 'bg-blue-500 text-white' // Highlight selected year
                : availableYears.includes(year)
                ? 'bg-gray-200 dark:bg-neutral-800 text-black dark:text-white' // Enabled but not selected
                : 'bg-gray-300 text-gray-500 cursor-not-allowed' // Disabled
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      
    </div>
  );
}
