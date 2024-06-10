export function trimWhitespaceFromObjectValues(obj: Record<string, any>) {
  const trimmedFormData: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      trimmedFormData[key] = value.trim();
    } else {
      trimmedFormData[key] = value;
    }
  }

  return trimmedFormData;
}
