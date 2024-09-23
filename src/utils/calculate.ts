import { OrderDateTotal, OrderStatus, QueryPageDataGrid } from '@/types';
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

export function calculatePercentageChange(totalCurrentPeriod: number, totalPreviousPeriod: number) {
  let percentageChange = 0;

  if (totalPreviousPeriod !== 0) {
    percentageChange = ((totalCurrentPeriod - totalPreviousPeriod) / totalPreviousPeriod) * 100;
  } else if (totalCurrentPeriod > 0) {
    percentageChange = 100;
  }

  return percentageChange;
}

function initArray(length: number) {
  return Array(length).fill(0);
}

function sumArrayValues(arr: number[]) {
  return arr.reduce((acc, count) => acc + count, 0);
}

export function calculateTotalMonthlySales(orderData: OrderDateTotal[]): number[] {
  // Create an array to store the total sales for each month
  const monthlySalesMap = initArray(12);

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
  const monthlyConversionsMap = initArray(12);

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

  const currentPeriodConversions = initArray(periodLength);
  const previousPeriodConversions = initArray(periodLength);

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

  const totalCurrentPeriodConversions = sumArrayValues(currentPeriodConversions);
  const totalPreviosPeriodConversions = sumArrayValues(previousPeriodConversions);

  return { currentPeriodConversions, totalCurrentPeriodConversions, totalPreviosPeriodConversions };
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

  const currentPeriodTotalOrderValues = initArray(periodLength);
  const currentPeriodOrderCounts = initArray(periodLength);

  const previousPeriodTotalOrderValues = initArray(periodLength);
  const previousPeriodOrderCounts = initArray(periodLength);

  const today = dayjs();
  const startDate = today.subtract(numberOfDays, 'day');

  const filteredOrders = orderData.filter((order) => {
    const orderDate = dayjs(order.createdAt);
    return orderDate.isBetween(startDate, today, null, '[]');
  });

  filteredOrders.forEach((order) => {
    const orderDate = dayjs(order.createdAt);
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

  const totalCurrentPeriodValue = sumArrayValues(currentPeriodTotalOrderValues);
  const totalOrdersInCurrentPeriod = sumArrayValues(currentPeriodOrderCounts);
  const totalAverageCurrentPeriod =
    totalOrdersInCurrentPeriod > 0 ? Math.round(totalCurrentPeriodValue / totalOrdersInCurrentPeriod) : 0;

  const totalPreviousPeriodValue = sumArrayValues(previousPeriodTotalOrderValues);
  const totalOrdersInPreviousPeriod = sumArrayValues(previousPeriodOrderCounts);
  const totalAveragePreviousPeriod =
    totalOrdersInCurrentPeriod > 0 ? Math.round(totalPreviousPeriodValue / totalOrdersInPreviousPeriod) : 0;

  return {
    currentPeriodDailyAverageOrderValues,
    totalAverageCurrentPeriod,
    totalAveragePreviousPeriod,
  };
}

export function calculateRefundRates(
  successfulOrderData: OrderDateTotal[],
  unsuccessfulOrders: { createdAt: string; orderStatus: OrderStatus }[],
  numberOfDays: number
) {
  // Ensure numberOfDays is even for splitting the periods
  const periodLength = Math.floor(numberOfDays / 2);

  const currentPeriodRefunds = initArray(periodLength);
  const previousPeriodRefunds = initArray(periodLength);
  const currentPeriodOtherUnsuccessfulOrders = initArray(periodLength);
  const previousPeriodOtherUnsuccessfulOrders = initArray(periodLength);
  const currentPeriodSuccessfulOrders = initArray(periodLength);
  const previousPeriodSuccessfulOrders = initArray(periodLength);

  const today = dayjs();
  const startDate = today.subtract(numberOfDays, 'day');

  const refundedOrders = unsuccessfulOrders.filter((order) => order.orderStatus === 'refunded');
  const otherUnsuccessfulOrders = unsuccessfulOrders.filter((order) => order.orderStatus !== 'refunded');

  const successfulOrderDates = successfulOrderData.map((order) => order.createdAt);
  const refundedOrderDates = refundedOrders.map((order) => order.createdAt);
  const otherUnsuccessfulOrderDates = otherUnsuccessfulOrders.map((order) => order.createdAt);

  // Filter orders within the last numberOfDays
  const filteredSuccessfulOrderDates = successfulOrderDates.filter((date) => {
    const orderDate = dayjs(date);
    return orderDate.isBetween(startDate, today, null, '[]'); // Inclusive of both bounds
  });

  // Helper to aggregate orders for each day into periods
  function aggregateOrders(orderDates: string[], currentPeriodArray: number[], previousPeriodArray: number[]) {
    return orderDates.forEach((date) => {
      const daysAgo = today.diff(dayjs(date), 'day');
      if (daysAgo < periodLength) {
        currentPeriodArray[periodLength - daysAgo - 1] += 1;
      } else if (daysAgo < numberOfDays) {
        previousPeriodArray[daysAgo - periodLength - 1] += 1;
      }
    });
  }

  aggregateOrders(refundedOrderDates, currentPeriodRefunds, previousPeriodRefunds);
  aggregateOrders(
    otherUnsuccessfulOrderDates,
    currentPeriodOtherUnsuccessfulOrders,
    previousPeriodOtherUnsuccessfulOrders
  );
  aggregateOrders(filteredSuccessfulOrderDates, currentPeriodSuccessfulOrders, previousPeriodSuccessfulOrders);

  function calculateTotalOrders(refunds: number[], otherUnsuccessful: number[], successful: number[]) {
    return refunds.map((_, index) => refunds[index] + otherUnsuccessful[index] + successful[index]);
  }

  const currentPeriodAllOrders = calculateTotalOrders(
    currentPeriodRefunds,
    currentPeriodOtherUnsuccessfulOrders,
    currentPeriodSuccessfulOrders
  );
  const previousPeriodAllOrders = calculateTotalOrders(
    previousPeriodRefunds,
    previousPeriodOtherUnsuccessfulOrders,
    previousPeriodSuccessfulOrders
  );

  const currentPeriodRefundRates = currentPeriodRefunds.map((refundCount, index) => {
    const orderCount = currentPeriodAllOrders[index];

    if (orderCount === 0 && refundCount === 0) return 0;

    if (orderCount === 0 && refundCount > 0) return 100;

    return (refundCount / orderCount) * 100;
  });

  function overallRefundRate(totalRefunds: number, totalOrders: number) {
    return totalOrders === 0 ? 0 : (totalRefunds / totalOrders) * 100;
  }

  const overallCurrentPeriodRefundRate = overallRefundRate(
    sumArrayValues(currentPeriodRefunds),
    sumArrayValues(currentPeriodAllOrders)
  );
  const overallPreviousPeriodRefundRate = overallRefundRate(
    sumArrayValues(previousPeriodRefunds),
    sumArrayValues(previousPeriodAllOrders)
  );

  return { currentPeriodRefundRates, overallCurrentPeriodRefundRate, overallPreviousPeriodRefundRate };
}
