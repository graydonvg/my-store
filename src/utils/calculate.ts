import { OrderDateTotal, QueryPageDataGrid } from '@/types';
import dayjs from 'dayjs';

export function calculateRoundedDiscountedPrice(price: number, percentage: number) {
  const discountedPrice = price - price * (percentage / 100);
  const roundedDiscountedPrice = Math.round(discountedPrice);

  return roundedDiscountedPrice;
}

export function calculateTablePagination(items: {}[] | null, page: QueryPageDataGrid, totalRowCount: number) {
  const queryStart = (page.number - 1) * page.rows;
  const itemsLength = items?.length ?? 0;
  const isEndOfData = queryStart + itemsLength >= totalRowCount;
  const lastPageNumber = Math.ceil(totalRowCount / page.rows) > 0 ? Math.ceil(totalRowCount / page.rows) : 1;

  return { isEndOfData, lastPageNumber };
}

export function calculateTotalSalesForCurrentDay(orderData: OrderDateTotal[]) {
  const startOfDay = dayjs().startOf('day');

  return orderData.reduce((total, order) => {
    if (dayjs(order.createdAt).isAfter(startOfDay)) {
      total += order.orderTotal;
    }
    return total;
  }, 0);
}

export function calculateTotalSalesForCurrentWeek(orderData: OrderDateTotal[]) {
  const startOfWeek = dayjs().startOf('week');

  return orderData.reduce((total, order) => {
    if (dayjs(order.createdAt).isAfter(startOfWeek)) {
      total += order.orderTotal;
    }
    return total;
  }, 0);
}

export function calculateTotalSalesForCurrentMonth(orderData: OrderDateTotal[]) {
  const startOfMonth = dayjs().startOf('month');

  return orderData.reduce((total, order) => {
    if (dayjs(order.createdAt).isAfter(startOfMonth)) {
      total += order.orderTotal;
    }
    return total;
  }, 0);
}

export function calculateTotalSalesForCurrentYear(orderData: OrderDateTotal[]) {
  const startOfYear = dayjs().startOf('year');

  return orderData.reduce((total, order) => {
    if (dayjs(order.createdAt).isAfter(startOfYear)) {
      total += order.orderTotal;
    }
    return total;
  }, 0);
}

export function calculateTotalMonthlySales(orderData: OrderDateTotal[]) {
  // Create an array to store the total sales for each month
  const monthlySalesMap = Array(12).fill(0);

  // Aggregate sales for each month
  orderData.forEach((order) => {
    const month = dayjs(order.createdAt).month(); // 0 (January) to 11 (December)
    monthlySalesMap[month] += order.orderTotal;
  });

  // Convert the monthly sales map to an array of objects
  const monthlySales = monthlySalesMap.map((totalSales, month) => ({ month, totalSales }));

  return monthlySales;
}
