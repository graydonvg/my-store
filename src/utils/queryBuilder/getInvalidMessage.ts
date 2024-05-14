export function getInvalidFilterColumnMessage(column: string | null) {
  return `The provided filter column '${column}' is invalid.`;
}

export function getInvalidFilterOperatorMessage(operator: string | null) {
  return `The provided filter operator '${operator}' is invalid.`;
}

export function getInvalidFilterValueMessage(value: string | null) {
  return `The provided filter value '${value}' is invalid.`;
}

export function getInvalidSortColumnMessage(column: string) {
  return `The provided sort column '${column}' is invalid.`;
}

export function getInvalidSortDirectionMessage(direction: string) {
  return `The provided sort direction '${direction}' is invalid. Options are 'asc' or 'desc' only.`;
}

export function getInvalidPageNumberMessage(number: number) {
  return `The provided page number '${number}' is invalid. Only numbers > 0.`;
}

export function getInvalidRowsPerPageMessage(rows: number) {
  return `The provided number of rows per page '${rows}' is invalid. Only numbers 1 - 100.`;
}
