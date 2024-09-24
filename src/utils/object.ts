// Object.entries function that also saving the type of the given object
export const typeSafeObjectEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

// Object.fromEntries function that also saving the type of the given object
export const typeSafeObjectFromEntries = <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>
>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } =>
  Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
