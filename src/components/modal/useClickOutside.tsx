import { useEffect, useCallback, MutableRefObject } from "react";

export default function useClickOutside(
  ref: MutableRefObject<HTMLDivElement>,
  callback: () => void
) {
  const onClickOutside = useCallback(
    (e: MouseEvent) => {
      if (ref && ref.current) {
        return !ref.current.contains(e.target as Node) && callback();
      }
    },
    [callback, ref]
  );
  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClickOutside, ref]);
}
