import { GridValidRowModel } from '@mui/x-data-grid';

export function getChangedDataGridValue(newObj: GridValidRowModel, oldObj: GridValidRowModel) {
  const changedValue: GridValidRowModel = {};

  for (let key in newObj) {
    if (newObj[key] !== oldObj[key]) {
      if (newObj[key] === '') {
        changedValue[key] = null;
      } else {
        changedValue[key] = newObj[key];
      }
    }
  }

  return changedValue;
}
