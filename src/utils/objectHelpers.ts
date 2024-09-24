export function getObjectKeyCount(obj: Record<string, any>) {
  return Object.keys(obj).length;
}

export function getEmptyObjectKeys(obj: Record<string, any>) {
  return Object.keys(obj).filter((key) => {
    const value = obj[key];

    return (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    );
  });
}
