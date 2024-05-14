import dayjs from 'dayjs';
import { QueryFilterDataGrid, QueryFilterBuilder } from '@/types';
import { validateEmail } from '../validate';

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
  const isValidEmail = validateEmail(`${filter.value}`);

  if (!isValidEmail) {
    return query;
  } else if (filter.operator === 'contains') {
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

function applyIsNotValueFilter({ query, filter }: FilterFunctionParams) {
  let column = 'userRoles.role';

  if (filter.operator === 'is') {
    if (filter.value === 'none') {
      return query.is(column, null);
    } else {
      return query.eq(column, filter.value);
    }
  } else if (filter.operator === 'not') {
    if (filter.value === 'none') {
      return query.not(column, 'is', null);
    } else {
      return query.neq(column, filter.value);
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

export function applyQueryFilter(query: QueryFilterBuilder, filter: QueryFilterDataGrid) {
  switch (filter.column) {
    case 'userId':
    case 'orderId':
      return applyIdFilter({ query, filter });
    case 'createdAt':
      return applyDateFilter({ query, filter });
    case 'firstName':
    case 'lastName':
    case 'contactNumber':
    case 'recipientFirstName':
    case 'recipientLastName':
    case 'recipientContactNumber':
    case 'province':
    case 'city':
      return applyStringFilter({ query, filter });
    case 'email':
      return applyEmailFilter({ query, filter });
    case 'role':
    case 'orderStatus':
      return applyIsNotValueFilter({ query, filter });
    case 'orderTotal':
      return applyNumberFilter({ query, filter });
    default:
      return query;
  }
}
