import { useLayoutEffect } from "react";

export default function useBlockScroll(open: boolean) {
  useLayoutEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }
    if (!open) {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [open]);
}
