/* eslint-disable @typescript-eslint/no-explicit-any */
type GetEnumKeys = <V>(enumVar: { [key in string]: V }) => string[];
export const getEnumKeys: GetEnumKeys = (enumVar) => Object.keys(enumVar);

type Debounce = <R>(
  cb: (...args: any[]) => R,
  ms?: number
) => [(...args: any[]) => Promise<R>, () => void];
export const debounce: Debounce = (cb, ms) => {
  let timer: ReturnType<typeof setTimeout>;

  type InnerDebounce = <R>(...args: any[]) => Promise<R>;
  const debounceFn: InnerDebounce = (...args) =>
    new Promise((resolve) => {
      if (timer) clearTimeout(timer);
      //   @ts-expect-error Can't get it to be typesafe... Generics :)
      timer = setTimeout(() => resolve(cb(...args)), ms);
    });

  const teardown = () => clearTimeout(timer);

  return [debounceFn, teardown];
};

export const isStringNumeric = (str: string) => /^\d+$/.test(str);
