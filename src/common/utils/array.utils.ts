import { getKeyValuesFromObject } from './object.utils';

export const checkArraysMatching = (smallArray: any[], bigArray: any[]): boolean => {
  if (!smallArray.length) return false;

  const smallArrayKeys = Object.keys(smallArray[0]);

  const smallArrayObj = smallArray.reduce((r, e) => {
    const key = getKeyValuesFromObject(e, smallArrayKeys);
    r[key] = true;
    return r;
  }, {});

  const bigArrayObj = bigArray.reduce((r, e) => {
    const key = getKeyValuesFromObject(e, smallArrayKeys);
    r[key] = true;
    return r;
  }, {});

  for (const e of Object.keys(smallArrayObj)) if (!bigArrayObj[e]) return false;

  for (const e of Object.keys(bigArrayObj)) if (!smallArrayObj[e]) return false;

  return true;
};

export const chunkArray = <T>(array: T[], size: number): T[][] =>
  array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size));
    return acc;
  }, [] as T[][]);

export function convertArrayToObj<T extends Record<string, any>>(array: T[], keys: (keyof T)[]): Record<string, T>;

export function convertArrayToObj<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  keys: (keyof T)[],
  value: K,
): Record<string, T[K]>;

export function convertArrayToObj<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  keys: (keyof T)[],
  value?: K,
): Record<string, T | T[K]> {
  return array.reduce(
    (acc, item) => {
      const objectKey = keys.map((key) => String(item[key])).join('');
      acc[objectKey] = value ? item[value] : item;
      return acc;
    },
    {} as Record<string, T | T[K]>,
  );
}

export function groupBy<T>(array: T[], keys: (keyof T)[]): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = keys.map((key) => item[key]).join('');
      if (!result[groupKey]) result[groupKey] = [];

      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

export const trimmedArray = (array: any[]) => array.map((v) => (typeof v === 'string' ? v.trim() : v));

export const mapOrder = (originalArray: any[], orderArray: any[], key: string) => {
  if (!originalArray || !orderArray || !key) return [];

  const clonedArray = [...originalArray];
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]);
  });

  return orderedArray;
};
