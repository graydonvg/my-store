import { GridValidRowModel } from '@mui/x-data-grid';

export function getChangedDataGridValues(newObj: GridValidRowModel, oldObj: GridValidRowModel) {
  const changedValues: GridValidRowModel = {};

  for (let key in newObj) {
    if (newObj[key] !== oldObj[key]) {
      if (newObj[key] === '') {
        changedValues[key] = null;
      } else {
        changedValues[key] = newObj[key];
      }
    }
  }

  return changedValues;
}
