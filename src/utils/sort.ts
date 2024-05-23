import { constants } from '@/constants';

export function sortItemSizesArrayForToggleButtons(
  a: { label: string; value: string },
  b: { label: string; value: string }
) {
  const indexOfA = constants.orderedSizesForToggleButtons.indexOf(a);
  const indexOfB = constants.orderedSizesForToggleButtons.indexOf(b);

  if (indexOfA !== -1 && indexOfB !== -1) {
    return indexOfA - indexOfB;
  } else if (indexOfA !== -1) {
    return -1;
  } else if (indexOfB !== -1) {
    return 1;
  } else {
    return 0;
  }
}

export function sortItemSizesArrayForStore(a: string, b: string) {
  const indexOfA = constants.orderedSizesForStore.indexOf(a);
  const indexOfB = constants.orderedSizesForStore.indexOf(b);

  if (indexOfA !== -1 && indexOfB !== -1) {
    return indexOfA - indexOfB;
  } else if (indexOfA !== -1) {
    return -1;
  } else if (indexOfB !== -1) {
    return 1;
  } else {
    return 0;
  }
}
