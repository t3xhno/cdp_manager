/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { useConfig } from "./useConfig";
import { debounce } from "@/utils/helpers";

export const useDebounce = <R>(
  cb: (...args: any[]) => R,
  ms?: number
): ((...args: any[]) => Promise<R>) => {
  const { DEBOUNCE_DELAY_MS } = useConfig();

  const [debounceFn, teardown] = debounce<R>(
    cb,
    (ms = ms || DEBOUNCE_DELAY_MS)
  );

  useEffect(() => () => teardown(), []);

  return debounceFn;
};
