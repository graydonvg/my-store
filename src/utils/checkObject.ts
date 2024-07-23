export function getObjectKeyCount(obj: Record<string, any>) {
  const objectKeysArray = [];

  for (const key in obj) {
    objectKeysArray.push(key);
  }

  return objectKeysArray.length;
}

export function getEmptyObjectKeys(obj: Record<string, any>) {
  const unfilledKeys: string[] = [];

  for (const key in obj) {
    const value = obj[key as keyof typeof obj] as {};

    if (
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      value === '' ||
      value === null
    ) {
      unfilledKeys.push(key);
    }
  }

  return unfilledKeys;
}
