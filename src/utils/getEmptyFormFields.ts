export function getEmptyFormFields(formData: {}): string[] {
  const unfilledFields: string[] = [];

  for (const key in formData) {
    const fieldValue = formData[key as keyof typeof formData] as {};

    if (
      fieldValue === undefined ||
      (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
      (Array.isArray(fieldValue) && fieldValue.length === 0) ||
      fieldValue === '' ||
      fieldValue === null
    ) {
      unfilledFields.push(key);
    }
  }

  return unfilledFields;
}
