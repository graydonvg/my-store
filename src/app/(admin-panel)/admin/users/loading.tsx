'use client';

import UsersDataGridToolbar from '@/components/adminPanel/users/UsersDataGridToolbar';
import getUsersDataGridColumns from '@/components/adminPanel/users/getUsersDataGridColumns';
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
      columns={getUsersDataGridColumns(
        {
          isAdmin: false,
          isManager: false,
          isOwner: false,
        },
        false
      )}
      toolbar={
        <UsersDataGridToolbar
          isDeleting={false}
          onDeleteClick={() => null}
          numberOfSelectedRows={0}
        />
      }
    />
  );
}
