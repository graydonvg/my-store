import dayjs from 'dayjs';
import { analyticsDataClient } from '@/lib/googleAnalytics/client';

export async function fetchMonthlyPageViewsForYear() {
  const [pageViews] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID!}`,
    dateRanges: [
      {
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
    ],
    dimensions: [{ name: 'month' }],
    metrics: [{ name: 'screenPageViews' }],
  });

  return pageViews;
}
