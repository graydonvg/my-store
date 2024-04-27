export default function calculateTablePagination(
  items: {}[] | null,
  queryStart: number,
  rowsPerPage: number,
  totalRowCount: number
) {
  const itemsLength = items?.length ?? 0;
  const isEndOfData = queryStart + itemsLength >= totalRowCount;
  const lastPageNumber = Math.ceil(totalRowCount / rowsPerPage);

  return { isEndOfData, lastPageNumber };
}