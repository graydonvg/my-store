export function generateUniqueFileName(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);
  const parts = fileName.split('.');

  return `${parts[0]}-${timestamp}-${randomString}.${parts[1]}`;
}
