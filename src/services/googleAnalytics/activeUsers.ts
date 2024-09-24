import { analyticsDataClient } from '@/lib/googleAnalytics/client';
import dayjs from 'dayjs';

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
