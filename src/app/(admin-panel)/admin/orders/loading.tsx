'use client';

import OrdersDataGridToolbar from '@/components/adminPanel/orders/OrdersDataGridToolbar';
import getOrdersDataGridColumns from '@/components/adminPanel/orders/getOrdersDataGridColumns';
import CustomDataGrid from '@/components/dataGrid/CustomDataGrid';

export default function Loading() {
  return (
    <CustomDataGrid
      loading={true}
      data={null}
      totalRowCount={0}
      querySuccess={true}
      queryMessage=""
      page={{ number: 1, rows: 5 }}
      sort={{ column: 'createdAt', direction: 'desc' }}
      filter={{ column: null, operator: null, value: null }}
      columns={getOrdersDataGridColumns('', false)}
      toolbar={<OrdersDataGridToolbar />}
    />
  );
}
