'use client';

import ProductsDataGridToolbar from '@/components/adminPanel/products/ProductsDataGridToolbar';
import getProductsDataGridColumns from '@/components/adminPanel/products/getProductsDataGridColumns';
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
      columns={getProductsDataGridColumns()}
      toolbar={
        <ProductsDataGridToolbar
          isDeleting={false}
          onDeleteClick={() => null}
          numberOfSelectedRows={0}
        />
      }
    />
  );
}
