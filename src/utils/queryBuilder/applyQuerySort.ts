import { QuerySortDataGrid, QueryFilterBuilder, DataGridOptions } from '@/types';

type SortFunctionParams = {
  query: QueryFilterBuilder;
  sort: QuerySortDataGrid;
};

function applySort({ query, sort }: SortFunctionParams) {
  if (sort.direction === 'asc') {
    return query.order(sort.column, { ascending: true });
  } else if (sort.direction === 'desc') {
    return query.order(sort.column, { ascending: false });
  } else {
    return query;
  }
}

function applyUsersQuerySort(query: QueryFilterBuilder, sort: QuerySortDataGrid) {
  switch (sort.column) {
    case 'createdAt':
    case 'firstName':
    case 'lastName':
    case 'email':
    case 'contactNumber':
      return applySort({ query, sort });
    case 'role':
      return applySort({ query, sort: { column: `userRoles(${sort.column})`, direction: sort.direction } });
    default:
      return query;
  }
}

function applyOrdersQuerySort(query: QueryFilterBuilder, sort: QuerySortDataGrid) {
  switch (sort.column) {
    case 'createdAt':
    case 'orderStatus':
    case 'orderTotal':
      return applySort({ query, sort });
    case 'firstName':
    case 'lastName':
    case 'contactNumber':
      return applySort({ query, sort: { column: `users(${sort.column})`, direction: sort.direction } });
    case 'recipientFirstName':
    case 'recipientLastName':
    case 'recipientContactNumber':
    case 'complexOrBuilding':
    case 'streetAddress':
    case 'suburb':
    case 'province':
    case 'city':
    case 'postalCode':
      return applySort({ query, sort: { column: `shippingDetails(${sort.column})`, direction: sort.direction } });
    default:
      return query;
  }
}

function applyProductsQuerySort(query: QueryFilterBuilder, sort: QuerySortDataGrid) {
  switch (sort.column) {
    case 'createdAt':
    case 'name':
    case 'brand':
    case 'category':
    case 'price':
    case 'isOnSale':
    case 'salePercentage':
      return applySort({ query, sort });
    default:
      return query;
  }
}

export function applyQuerySort(dataGrid: DataGridOptions, query: QueryFilterBuilder, sort: QuerySortDataGrid) {
  switch (dataGrid) {
    case 'products':
      return applyProductsQuerySort(query, sort);
    case 'users':
      return applyUsersQuerySort(query, sort);
    case 'orders':
      return applyOrdersQuerySort(query, sort);
    default:
      return query;
  }
}
