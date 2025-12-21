export const compareObjectsGetUpdatedProperties = <T extends Record<string, any>, K extends keyof T>(
  oldObj: T,
  newObj: T,
  blacklist: K[],
) => {
  const changes: { [P in keyof T]: { old: T[P]; new: T[P] } } = {} as any;

  (Object.keys({ ...oldObj, ...newObj }) as (keyof T)[]).forEach((key) => {
    if (
      [...blacklist, 'id', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'updatedReason', 'url'].includes(
        key as K,
      )
    )
      return;

    if (oldObj[key] && newObj[key] && oldObj[key] !== newObj[key])
      changes[key] = { old: oldObj[key] || ('#' as any), new: newObj[key] };
  });

  return changes;
};

// Sắp xếp theo độ dài giảm dần của key cho object
export const sortObjectByKeyLengthDesc = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(Object.entries(obj).sort(([keyA], [keyB]) => keyB.length - keyA.length));
};

export const getKeyValuesFromObject = (object: any, keys: string[]) => {
  let key = '';
  keys.forEach((e) => (key += object[e]));
  return key;
};

export const omitProperties = <T extends object, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToOmit.includes(key as K))) as Omit<T, K>;
};
