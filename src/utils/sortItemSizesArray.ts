import { ORDERED_SIZES_FOR_STORE, ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/config';

export function sortItemSizesArrayForToggleButtons(
  a: { label: string; value: string },
  b: { label: string; value: string }
) {
  const indexOfA = ORDERED_SIZES_FOR_TOGGLE_BUTTONS.indexOf(a);
  const indexOfB = ORDERED_SIZES_FOR_TOGGLE_BUTTONS.indexOf(b);

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
  const indexOfA = ORDERED_SIZES_FOR_STORE.indexOf(a);
  const indexOfB = ORDERED_SIZES_FOR_STORE.indexOf(b);

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
