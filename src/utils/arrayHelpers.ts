export function initArray(length: number) {
  return Array(length).fill(0);
}

export function sumArrayValues(arr: number[]) {
  return arr.reduce((acc, count) => acc + count, 0);
}
