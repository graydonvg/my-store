import { fetchMonthlyPageViewsForYear } from '@/services/googleAnalytics/pageViews';
import dayjs from 'dayjs';

type PageViews = {
  rows: [{ dimensionValues: { value: string }[]; metricValues: { value: string }[] }];
};

function processPageViews(pageViews: PageViews) {
  const pageViewsMonths = pageViews?.rows?.map((row) => row.dimensionValues?.[0].value) || [];
  const pageViewsValues = pageViews?.rows?.map((row) => Number(row.metricValues?.[0].value)) || [];

  const pageViewsMap = new Map();
  pageViewsMonths.forEach((date, index) => {
    pageViewsMap.set(date, pageViewsValues[index]);
  });

  return pageViewsMap;
}

function preparePageViewsArrays(pageViewsMap: Map<string, number>) {
  const pageViewsArray = [];

  for (let i = 0; i < 12; i++) {
    const currentMonth = dayjs().startOf('year').add(i, 'month').format('MM');

    pageViewsArray.push(pageViewsMap.get(currentMonth) || 0);
  }

  return pageViewsArray;
}

export async function getMonthlyPageViewsForYear() {
  const pageViews = await fetchMonthlyPageViewsForYear();
  const pageViewsMap = processPageViews(pageViews as PageViews);
  const pageViewsArray = preparePageViewsArrays(pageViewsMap);

  return pageViewsArray;
}
