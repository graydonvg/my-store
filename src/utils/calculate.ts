import { MonthlyOrderData, QueryPageDataGrid } from '@/types';
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

type CumulativeSales = {
  day: number;
  amount: number;
};

export function calculateCumulativeSales(orderData: MonthlyOrderData[]) {
  const dailySalesMap: { [key: number]: number } = orderData.reduce((acc: { [key: number]: number }, order) => {
    const date = dayjs(order.createdAt).date();

    acc[date] = (acc[date] ?? 0) + order.orderTotal;
    return acc;
  }, {});

  const cumulativeSales: CumulativeSales[] = [];
  let amount = 0;

  for (let day = 1; day <= dayjs().date(); day++) {
    amount += dailySalesMap[day] ?? 0;
    cumulativeSales.push({ day, amount });
  }

  return cumulativeSales;
}

export function calculateDailySales(orderData: MonthlyOrderData[]) {
  const startOfDay = dayjs().startOf('day');

  return orderData.reduce((total, order) => {
    if (dayjs(order.createdAt).isAfter(startOfDay)) {
      total += order.orderTotal;
    }
    return total;
  }, 0);
}

export function calculateWeeklySales(orderData: MonthlyOrderData[]) {
  const startOfWeek = dayjs().startOf('week');

  return orderData.reduce((total, order) => {
    if (dayjs(order.createdAt).isAfter(startOfWeek)) {
      total += order.orderTotal;
    }
    return total;
  }, 0);
}

export function calculateMonthlySales(orderData: MonthlyOrderData[]) {
  return orderData.reduce((total, order) => total + order.orderTotal, 0);
}
