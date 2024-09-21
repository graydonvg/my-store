import dayjs from 'dayjs';
import { analyticsDataClient } from './client';

async function fetchActiveUsersForDays(numberOfDays: number) {
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

type ActiveUsers = {
  rows: [{ dimensionValues: { value: string }[]; metricValues: { value: string }[] }];
};

function processActiveUsers(activeUsers: ActiveUsers) {
  const activeUsersDates = activeUsers?.rows?.map((row) => row.dimensionValues?.[0].value) || [];
  const activeUsersValues = activeUsers?.rows?.map((row) => Number(row.metricValues?.[0].value)) || [];

  const activeUsersMap = new Map();
  activeUsersDates.forEach((date, index) => {
    activeUsersMap.set(dayjs(date).format('YYYY-MM-DD'), activeUsersValues[index]);
  });

  return activeUsersMap;
}

function prepareActiveUsersArrays(activeUsersMap: Map<string, number>, numberOfDays: number) {
  const periodLength = Math.floor(numberOfDays / 2);
  const currentPeriodUsers = [];
  const previousPeriodUsers = [];
  const period = dayjs().subtract(numberOfDays, 'day');

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = period.add(i, 'day').format('YYYY-MM-DD');

    if (i < periodLength) {
      previousPeriodUsers.push(activeUsersMap.get(currentDate) || 0);
    } else {
      currentPeriodUsers.push(activeUsersMap.get(currentDate) || 0);
    }
  }

  return { currentPeriodUsers, previousPeriodUsers };
}

function calculateActiveUserTotalsAndPercentageChange(currentPeriodUsers: number[], previousPeriodUsers: number[]) {
  const totalCurrentUsers = currentPeriodUsers.reduce((sum, current) => sum + current, 0);
  const totalPreviousUsers = previousPeriodUsers.reduce((sum, current) => sum + current, 0);

  return { totalCurrentUsers, totalPreviousUsers };
}

export async function getActiveUsersData(daysOfDataToFetch: number) {
  const activeUsers = await fetchActiveUsersForDays(daysOfDataToFetch);
  const activeUsersMap = processActiveUsers(activeUsers as ActiveUsers);
  const { currentPeriodUsers, previousPeriodUsers } = prepareActiveUsersArrays(activeUsersMap, daysOfDataToFetch);

  const { totalCurrentUsers, totalPreviousUsers } = calculateActiveUserTotalsAndPercentageChange(
    currentPeriodUsers,
    previousPeriodUsers
  );

  return { totalCurrentUsers, currentPeriodUsers, totalPreviousUsers };
}
