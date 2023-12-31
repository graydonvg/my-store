export function getNumberOfFormFields(formData: {}): number {
  const formFieldsArray = [];

  for (const key in formData) {
    formFieldsArray.push(key);
  }

  return formFieldsArray.length;
}
