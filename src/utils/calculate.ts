import { OrderDateTotal, QueryPageDataGrid } from '@/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export function calculateRoundedDiscountedPrice(price: number, percentage: number) {
  const discountedPrice = price - price * (percentage / 100);
  const roundedDiscountedPrice = Math.round(discountedPrice);

  return roundedDiscountedPrice;
}

export function calculatePagination(items: {}[] | null, page: QueryPageDataGrid, totalRowCount: number) {
  const queryStart = (page.number - 1) * page.rows;
  const itemsLength = items?.length ?? 0;
  const isEndOfData = queryStart + itemsLength >= totalRowCount;
  const lastPageNumber = Math.ceil(totalRowCount / page.rows) > 0 ? Math.ceil(totalRowCount / page.rows) : 1;

  return { isEndOfData, lastPageNumber };
}

export function calculateTotalMonthlySales(orderData: OrderDateTotal[]): number[] {
  // Create an array to store the total sales for each month
  const monthlySalesMap = Array(12).fill(0);

  // Aggregate sales for each month
  orderData.forEach((order) => {
    const month = dayjs(order.createdAt).month(); // 0 (January) to 11 (December)
    monthlySalesMap[month] += order.orderTotal;
  });

  // Convert the monthly sales map to an array of objects
  const monthlySales = monthlySalesMap.map((totalSales) => totalSales);

  return monthlySales;
}

export function calculateTotalMonthlyConversions(orderData: OrderDateTotal[]): number[] {
  // Create an array to store the total conversions for each month
  const monthlyConversionsMap = Array(12).fill(0);

  // Aggregate conversions for each month
  orderData.forEach((order) => {
    const month = dayjs(order.createdAt).month(); // 0 (January) to 11 (December)
    monthlyConversionsMap[month] += 1;
  });

  return monthlyConversionsMap;
}

export function calculateTotalConversions(
  orderData: OrderDateTotal[],
  numberOfDays: number
): {
  currentPeriodConversions: number[];
  totalCurrentPeriodConversions: number;
  totalPreviosPeriodConversions: number;
} {
  // Ensure numberOfDays is even for splitting the periods
  const periodLength = Math.floor(numberOfDays / 2);

  const currentPeriodConversions = Array(periodLength).fill(0);
  const previousPeriodConversions = Array(periodLength).fill(0);

  const today = dayjs();
  const startDate = today.subtract(numberOfDays, 'day');

  // Filter orders within the last numberOfDays
  const filteredOrders = orderData.filter((order) => {
    const orderDate = dayjs(order.createdAt);
    return orderDate.isBetween(startDate, today, null, '[]'); // Inclusive of both bounds
  });

  // Aggregate conversions for each day
  filteredOrders.forEach((order) => {
    const orderDate = dayjs(order.createdAt);
    const daysAgo = today.diff(orderDate, 'day');

    if (daysAgo < periodLength) {
      // current period
      const index = periodLength - daysAgo - 1;
      currentPeriodConversions[index] += 1;
    } else if (daysAgo >= periodLength && daysAgo < numberOfDays) {
      // previous period
      const index = daysAgo - periodLength - 1;
      previousPeriodConversions[index] += 1;
    }
  });

  const totalCurrentPeriodConversions = currentPeriodConversions.reduce((acc, val) => acc + val, 0);
  const totalPreviosPeriodConversions = previousPeriodConversions.reduce((acc, val) => acc + val, 0);

  return { currentPeriodConversions, totalCurrentPeriodConversions, totalPreviosPeriodConversions };
}

export function calculateTotalPeriodConverions(dailyConversion: number[]) {
  return dailyConversion.reduce((acc, totalConverions) => {
    return (acc += totalConverions);
  }, 0);
}

export function calculateAverageOrderValues(
  orderData: OrderDateTotal[],
  numberOfDays: number
): {
  currentPeriodDailyAverageOrderValues: number[];
  totalAverageCurrentPeriod: number;
  totalAveragePreviousPeriod: number;
} {
  const periodLength = Math.floor(numberOfDays / 2);

  const currentPeriodTotalOrderValues = Array(periodLength).fill(0);
  const currentPeriodOrderCounts = Array(periodLength).fill(0);

  const previousPeriodTotalOrderValues = Array(periodLength).fill(0);
  const previousPeriodOrderCounts = Array(periodLength).fill(0);

  const today = dayjs().startOf('day');
  const startDate = today.subtract(numberOfDays, 'day').startOf('day');

  const filteredOrders = orderData.filter((order) => {
    const orderDate = dayjs(order.createdAt).startOf('day');
    return orderDate.isBetween(startDate, today, null, '[]');
  });

  filteredOrders.forEach((order) => {
    const orderDate = dayjs(order.createdAt).startOf('day');
    const daysAgo = today.diff(orderDate, 'day');

    if (daysAgo < periodLength) {
      const index = periodLength - daysAgo - 1;
      currentPeriodTotalOrderValues[index] += order.orderTotal;
      currentPeriodOrderCounts[index] += 1;
    } else if (daysAgo >= periodLength && daysAgo < numberOfDays) {
      const index = daysAgo - periodLength - 1;
      previousPeriodTotalOrderValues[index] += order.orderTotal;
      previousPeriodOrderCounts[index] += 1;
    }
  });

  const currentPeriodDailyAverageOrderValues = currentPeriodTotalOrderValues.map((total, index) =>
    currentPeriodOrderCounts[index] > 0 ? Math.round(total / currentPeriodOrderCounts[index]) : 0
  );

  const totalCurrentPeriodValue = currentPeriodTotalOrderValues.reduce((acc, val) => acc + val, 0);
  const totalOrdersInCurrentPeriod = currentPeriodOrderCounts.reduce((acc, val) => acc + val, 0);
  const totalAverageCurrentPeriod =
    totalOrdersInCurrentPeriod > 0 ? Math.round(totalCurrentPeriodValue / totalOrdersInCurrentPeriod) : 0;

  const totalPreviousPeriodValue = previousPeriodTotalOrderValues.reduce((acc, val) => acc + val, 0);
  const totalOrdersInPreviousPeriod = previousPeriodOrderCounts.reduce((acc, val) => acc + val, 0);
  const totalAveragePreviousPeriod =
    totalOrdersInCurrentPeriod > 0 ? Math.round(totalPreviousPeriodValue / totalOrdersInPreviousPeriod) : 0;

  return {
    currentPeriodDailyAverageOrderValues,
    totalAverageCurrentPeriod,
    totalAveragePreviousPeriod,
  };
}
