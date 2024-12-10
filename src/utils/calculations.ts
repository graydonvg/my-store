import { OrderDateTotal, OrderStatus, QueryPageDataGrid } from '@/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { initArray, sumArrayValues } from './arrayHelpers';

dayjs.extend(isBetween);

export function calculateRoundedDiscountedPrice(price: number, percentage: number) {
  const discountedPrice = price - price * (percentage / 100);
  return Math.round(discountedPrice);
}

export function calculatePagination(items: {}[] | null, page: QueryPageDataGrid, totalRowCount: number) {
  const queryStart = (page.number - 1) * page.rows;
  const itemsLength = items?.length ?? 0;
  const isEndOfData = queryStart + itemsLength >= totalRowCount;
  const lastPageNumber = Math.max(Math.ceil(totalRowCount / page.rows), 1);

  return { isEndOfData, lastPageNumber };
}

export function calculatePercentageChange(totalCurrentPeriod: number, totalPreviousPeriod: number) {
  if (totalPreviousPeriod === 0) {
    return totalCurrentPeriod > 0 ? 100 : 0;
  }
  return ((totalCurrentPeriod - totalPreviousPeriod) / totalPreviousPeriod) * 100;
}

function aggregateSalesOrConversions(orderData: OrderDateTotal[], key: 'orderTotal' | 'conversion', length: number) {
  const resultMap = initArray(length);

  orderData.forEach((order) => {
    const month = dayjs(order.createdAt).month(); // 0 (January) to 11 (December)
    if (key === 'orderTotal') {
      resultMap[month] += order.orderTotal;
    } else if (key === 'conversion') {
      resultMap[month] += 1;
    }
  });

  return resultMap;
}

export function calculateTotalMonthlySales(orderData: OrderDateTotal[]) {
  return aggregateSalesOrConversions(orderData, 'orderTotal', 12);
}

export function calculateTotalMonthlyConversions(orderData: OrderDateTotal[]) {
  return aggregateSalesOrConversions(orderData, 'conversion', 12);
}

export function calculateTotalRegisteredCustomers(signUpDates: { createdAt: string }[], numberOfDays: number) {
  const periodLength = Math.floor(numberOfDays / 2);
  const currentPeriodRegistrations = initArray(periodLength);
  const previousPeriodRegistrations = initArray(periodLength);
  const today = dayjs();

  signUpDates.forEach((signUpDate) => {
    const daysAgo = today.diff(dayjs(signUpDate.createdAt), 'day');

    if (daysAgo < periodLength) {
      currentPeriodRegistrations[periodLength - daysAgo - 1] += 1;
    } else if (daysAgo < numberOfDays) {
      previousPeriodRegistrations[daysAgo - periodLength - 1] += 1;
    }
  });

  return {
    currentPeriodRegistrations,
    totalCurrentPeriodRegistrations: sumArrayValues(currentPeriodRegistrations),
    totalPreviosPeriodRegistrations: sumArrayValues(previousPeriodRegistrations),
  };
}

export function calculateTotalConversions(orderData: OrderDateTotal[], numberOfDays: number) {
  const periodLength = Math.floor(numberOfDays / 2);
  const currentPeriodConversions = initArray(periodLength);
  const previousPeriodConversions = initArray(periodLength);
  const today = dayjs();
  const startDate = today.subtract(numberOfDays, 'day');

  const filteredOrders = orderData.filter((order) => dayjs(order.createdAt).isBetween(startDate, today, null, '[]'));

  filteredOrders.forEach((order) => {
    const daysAgo = today.diff(dayjs(order.createdAt), 'day');

    if (daysAgo < periodLength) {
      currentPeriodConversions[periodLength - daysAgo - 1] += 1;
    } else if (daysAgo < numberOfDays) {
      previousPeriodConversions[daysAgo - periodLength - 1] += 1;
    }
  });

  return {
    currentPeriodConversions,
    totalCurrentPeriodConversions: sumArrayValues(currentPeriodConversions),
    totalPreviosPeriodConversions: sumArrayValues(previousPeriodConversions),
  };
}

export function calculateAverageOrderValues(orderData: OrderDateTotal[], numberOfDays: number) {
  const periodLength = Math.floor(numberOfDays / 2);
  const currentPeriodTotalOrderValues = initArray(periodLength);
  const currentPeriodOrderCounts = initArray(periodLength);
  const previousPeriodTotalOrderValues = initArray(periodLength);
  const previousPeriodOrderCounts = initArray(periodLength);

  const today = dayjs();
  const startDate = today.subtract(numberOfDays, 'day');
  const filteredOrders = orderData.filter((order) => dayjs(order.createdAt).isBetween(startDate, today, null, '[]'));

  filteredOrders.forEach((order) => {
    const daysAgo = today.diff(dayjs(order.createdAt), 'day');
    if (daysAgo < periodLength) {
      const index = periodLength - daysAgo - 1;
      currentPeriodTotalOrderValues[index] += order.orderTotal;
      currentPeriodOrderCounts[index] += 1;
    } else if (daysAgo < numberOfDays) {
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
    totalOrdersInPreviousPeriod > 0 ? Math.round(totalPreviousPeriodValue / totalOrdersInPreviousPeriod) : 0;

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

  const filteredSuccessfulOrderDates = successfulOrderDates.filter((date) => {
    const orderDate = dayjs(date);
    return orderDate.isBetween(startDate, today, null, '[]'); // Inclusive of both bounds
  });

  function aggregateOrders(orderDates: string[], currentPeriodArray: number[], previousPeriodArray: number[]) {
    orderDates.forEach((date) => {
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
