import {useCallback, useRef} from "react";

export function useEvent(fn = () => {
}) {
  const ref = useRef(fn);
  ref.current = fn;
  // @ts-expect-error - any is okay here
  return useCallback((...args) => {
    // @ts-expect-error - any is okay here
    return ref.current.apply(null, args);
  }, []);
}
