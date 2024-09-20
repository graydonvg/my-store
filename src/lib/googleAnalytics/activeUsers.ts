import dayjs from 'dayjs';
import { analyticsDataClient } from './client';

export async function fetchActiveUsersForDays(numberOfDays: number) {
  const today = dayjs();
  const startDate = today.subtract(numberOfDays, 'day').format('YYYY-MM-DD');

  const [activeUsers] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID!}`,
    dateRanges: [
      {
        startDate,
        endDate: today.format('YYYY-MM-DD'),
      },
    ],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }],
  });

  return activeUsers;
}

export type ActiveUsers = {
  rows: [{ dimensionValues: { value: string }[]; metricValues: { value: string }[] }];
};

export function processActiveUsers(activeUsers: ActiveUsers) {
  const activeUsersDates = activeUsers?.rows?.map((row) => row.dimensionValues?.[0].value) || [];
  const activeUsersValues = activeUsers?.rows?.map((row) => Number(row.metricValues?.[0].value)) || [];

  const activeUsersMap = new Map();
  activeUsersDates.forEach((date, index) => {
    activeUsersMap.set(dayjs(date).format('YYYY-MM-DD'), activeUsersValues[index]);
  });

  return activeUsersMap;
}

export function prepareActiveUsersArrays(activeUsersMap: Map<string, number>, numberOfDays: number) {
  const currentPeriodUsers = [];
  const previousPeriodUsers = [];
  const period = dayjs().subtract(numberOfDays, 'day');

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = period.add(i, 'day').format('YYYY-MM-DD');

    if (i < numberOfDays / 2) {
      previousPeriodUsers.push(activeUsersMap.get(currentDate) || 0);
    } else {
      currentPeriodUsers.push(activeUsersMap.get(currentDate) || 0);
    }
  }

  return { currentPeriodUsers, previousPeriodUsers };
}

export function calculateActiveUserTotalsAndPercentageChange(
  currentPeriodUsers: number[],
  previousPeriodUsers: number[]
) {
  const totalCurrentUsers = currentPeriodUsers.reduce((sum, current) => sum + current, 0);
  const totalPreviousUsers = previousPeriodUsers.reduce((sum, current) => sum + current, 0);

  let percentageChange = 0;
  if (totalPreviousUsers !== 0) {
    percentageChange = ((totalCurrentUsers - totalPreviousUsers) / totalPreviousUsers) * 100;
  } else if (totalCurrentUsers > 0) {
    percentageChange = 100; // If previous total is 0 and current total is greater than 0
  }

  return { totalCurrentUsers, totalPreviousUsers, percentageChange };
}
