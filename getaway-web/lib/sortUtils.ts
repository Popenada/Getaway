// number sort logic
export const compareNumbers = (a: number, b: number, order: 'asc' | 'dsc') =>
  order === 'asc' ? a - b : b - a;
// string sort logic
export const compareStrings = (a: string, b: string, order: 'asc' | 'dsc') =>
  order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
// date compare logic UNUSED SAVED FOR LATER
export const compareDates = (a: string, b: string, order: 'asc' | 'dsc') => {
  const timeA = new Date(a).getTime();
  const timeB = new Date(b).getTime();
  return order === 'asc' ? timeA - timeB : timeB - timeA;
};

// THE MEGA sorter
export function sortData<T>(
  data: T[],
  key: keyof T,
  type: 'number' | 'string' | 'date',
  order: 'asc' | 'dsc' = 'asc',
): T[] {
  return [...data].sort((a, b) => {
    const valA = a[key] as any;
    const valB = b[key] as any;

    if (type === 'number') return compareNumbers(valA, valB, order);
    if (type === 'string') return compareStrings(valA, valB, order);
    if (type === 'date') return compareDates(valA, valB, order);
    return 0;
  });
}