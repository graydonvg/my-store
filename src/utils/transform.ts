export function trimWhitespaceFromObjectValues(obj: Record<string, any>) {
  const objectWithTrimmedValues: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      objectWithTrimmedValues[key] = value.trim();
    } else {
      objectWithTrimmedValues[key] = value;
    }
  }

  return objectWithTrimmedValues;
}
