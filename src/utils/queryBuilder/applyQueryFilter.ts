import dayjs from 'dayjs';
import { QueryFilterDataGrid, QueryFilterBuilder, DataGridOptions } from '@/types';

type FilterFunctionParams = {
  query: QueryFilterBuilder;
  filter: QueryFilterDataGrid;
};

function applyIdFilter({ query, filter }: FilterFunctionParams) {
  if (filter.operator === 'equals') {
    return query.eq(filter.column!, filter.value);
  } else {
    return query;
  }
}

function applyDateFilter({ query, filter }: FilterFunctionParams) {
  // Cannot use eq, etc because of timestamptz type
  // e.g. To filter by specific date (e.g. 2024/01/02) use start of day < given date < end of day
  const givenDate = dayjs(filter.value);

  const startOfDay = givenDate.startOf('day').format('YYYY/MM/DD HH:mm:ss');
  const endOfDay = givenDate.endOf('day').format('YYYY/MM/DD HH:mm:ss');

  if (filter.operator === 'is') {
    return query.gt(filter.column!, startOfDay).lt(filter.column!, endOfDay);
  } else if (filter.operator === 'not') {
    return query.or(`${filter.column}.lt.${startOfDay},${filter.column}.gt.${endOfDay}`);
  } else if (filter.operator === 'after') {
    return query.gt(filter.column!, endOfDay);
  } else if (filter.operator === 'onOrAfter') {
    return query.gte(filter.column!, startOfDay);
  } else if (filter.operator === 'before') {
    return query.lt(filter.column!, startOfDay);
  } else if (filter.operator === 'onOrBefore') {
    return query.lte(filter.column!, endOfDay);
  } else {
    return query;
  }
}

function applyStringFilter({ query, filter }: FilterFunctionParams) {
  if (filter.operator === 'contains') {
    return query.ilike(filter.column!, `%${filter.value}%`);
  } else if (filter.operator === 'equals') {
    return query.eq(filter.column!, filter.value);
  } else if (filter.operator === 'startsWith') {
    return query.like(filter.column!, `${filter.value}%`);
  } else if (filter.operator === 'endsWith') {
    return query.like(filter.column!, `%${filter.value}`);
  } else if (filter.operator === 'isEmpty') {
    return query.or(`${filter.column!}.is.null, ${filter.column!}.eq.""`);
  } else if (filter.operator === 'isNotEmpty') {
    return query.not(filter.column!, 'is', null).not(filter.column!, 'eq', '');
  } else {
    return query;
  }
}

function applyEmailFilter({ query, filter }: FilterFunctionParams) {
  if (filter.operator === 'contains') {
    return query.ilike(filter.column!, `%${filter.value}%`);
  } else if (filter.operator === 'equals') {
    return query.eq(filter.column!, filter.value);
  } else if (filter.operator === 'startsWith') {
    return query.ilike(filter.column!, `${filter.value}%`);
  } else if (filter.operator === 'endsWith') {
    return query.ilike(filter.column!, `%${filter.value}`);
  } else {
    return query;
  }
}

function applyIsOrNotValueFilter({ query, filter }: FilterFunctionParams) {
  if (filter.operator === 'is') {
    if (filter.value === 'none') {
      return query.is(filter.column!, null);
    } else {
      return query.eq(filter.column!, filter.value);
    }
  } else if (filter.operator === 'not') {
    if (filter.value === 'none') {
      return query.not(filter.column!, 'is', null);
    } else {
      return query.neq(filter.column!, filter.value);
    }
  } else {
    return query;
  }
}

function applyNumberFilter({ query, filter }: FilterFunctionParams) {
  if (filter.operator === '=') {
    return query.eq(filter.column!, filter.value);
  } else if (filter.operator === '!=') {
    return query.neq(filter.column!, filter.value);
  } else if (filter.operator === '>') {
    return query.gt(filter.column!, filter.value);
  } else if (filter.operator === '>=') {
    return query.gte(filter.column!, filter.value);
  } else if (filter.operator === '<') {
    return query.lt(filter.column!, filter.value);
  } else if (filter.operator === '<=') {
    return query.lte(filter.column!, filter.value);
  } else {
    return query;
  }
}

function applyBooleanFilter({ query, filter }: FilterFunctionParams) {
  if (filter.value === 'true') {
    return query.eq(filter.column!, true);
  } else {
    return query.eq(filter.column!, false);
  }
}

function applyProductsQueryFilter(query: QueryFilterBuilder, filter: QueryFilterDataGrid) {
  switch (filter.column) {
    case 'createdAt':
      return applyDateFilter({ query, filter });
    case 'name':
    case 'brand':
      return applyStringFilter({ query, filter });
    case 'category':
      return applyIsOrNotValueFilter({ query, filter });
    case 'isOnSale':
      return applyBooleanFilter({ query, filter });
    case 'price':
    case 'salePercentage':
      return applyNumberFilter({ query, filter });
    default:
      return query;
  }
}

function applyOrdersQueryFilter(query: QueryFilterBuilder, filter: QueryFilterDataGrid) {
  switch (filter.column) {
    case 'orderId':
      return applyIdFilter({ query, filter });
    case 'createdAt':
      return applyDateFilter({ query, filter });
    case 'firstName':
    case 'lastName':
    case 'contactNumber':
      return applyStringFilter({
        query,
        filter: { column: `users.${filter.column}`, operator: filter.operator, value: filter.value },
      });
    case 'recipientFirstName':
    case 'recipientLastName':
    case 'recipientContactNumber':
    case 'complexOrBuilding':
    case 'streetAddress':
    case 'suburb':
    case 'province':
    case 'city':
      return applyStringFilter({
        query,
        filter: { column: `shippingDetails.${filter.column}`, operator: filter.operator, value: filter.value },
      });
    case 'email':
      return applyEmailFilter({ query, filter });
    case 'orderStatus':
      return applyIsOrNotValueFilter({ query, filter });
    case 'orderTotal':
      return applyNumberFilter({ query, filter });
    case 'postalCode':
      return applyNumberFilter({
        query,
        filter: { column: `shippingDetails.${filter.column}`, operator: filter.operator, value: filter.value },
      });
    default:
      return query;
  }
}

function applyUsersQueryFilter(query: QueryFilterBuilder, filter: QueryFilterDataGrid) {
  switch (filter.column) {
    case 'userId':
      return applyIdFilter({ query, filter });
    case 'createdAt':
      return applyDateFilter({ query, filter });
    case 'firstName':
    case 'lastName':
    case 'contactNumber':
      return applyStringFilter({ query, filter });
    case 'email':
      return applyEmailFilter({ query, filter });
    case 'role':
      return applyIsOrNotValueFilter({
        query,
        filter: { column: `userRoles.${filter.column}`, operator: filter.operator, value: filter.value },
      });
    default:
      return query;
  }
}

export function applyQueryFilter(dataGrid: DataGridOptions, query: QueryFilterBuilder, filter: QueryFilterDataGrid) {
  switch (dataGrid) {
    case 'products':
      return applyProductsQueryFilter(query, filter);
    case 'orders':
      return applyOrdersQueryFilter(query, filter);
    case 'users':
      return applyUsersQueryFilter(query, filter);
    default:
      return query;
  }
}
