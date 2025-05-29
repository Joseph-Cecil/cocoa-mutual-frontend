import { DatabaseSchema } from "types/report";

// Mapping of month names to proper date format (for the 'date' field)
const monthMap: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export function transformApiDataToTableRows(apiData: any): DatabaseSchema[] {
  const rows: DatabaseSchema[] = [];

  const { staffId, monthly, interestPaid, withdrawal, balanceAfterInterest, year } = apiData;

  if (!monthly || typeof monthly !== "object") return [];

  Object.entries(monthly).forEach(([month, amount], index) => {
    if (monthMap[month] && typeof amount === "number") {
      rows.push({
        id: `${staffId}-${month}`,
        userId: String(staffId),
        date: `${year}-${monthMap[month]}-01`, // e.g., "2024-03-01"
        description: `Monthly contribution for ${month}`,
        monthly: amount,
        interestPaid: index === 11 ? interestPaid ?? 0 : 0, // Show interest on last row
        withdrawal: index === 11 ? withdrawal ?? 0 : 0, // Show withdrawal on last row
        balanceAfterInterest: index === 11 ? balanceAfterInterest ?? 0 : 0, // Show final balance once
      });
    }
  });

  return rows;
}
