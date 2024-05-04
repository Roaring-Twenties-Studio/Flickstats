import { useState, useRef, useLayoutEffect } from "react";
import { PDFPageProxy } from "pdfjs-dist";

type HookProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  page: PDFPageProxy;
  open?: boolean;
};

export const useDrawPDF = ({ canvasRef, page, open }: HookProps) => {
  const [isError, setIsError] = useState(false);
  const renderTask = useRef<ReturnType<PDFPageProxy["render"]>>(null);

  useLayoutEffect(() => {
    const drawPDF = (page: PDFPageProxy) => {
      const rotation = page.rotate;
      const adjustedScale = window.devicePixelRatio;
      const viewport = page.getViewport({ scale: adjustedScale, rotation });
      const canvasEl = canvasRef?.current;
      if (!canvasEl || !open) return;
      const canvasContext = canvasEl.getContext("2d");
      if (!canvasContext) return;
      canvasEl.style.width = "150px";
      canvasEl.style.height = "200px";
      canvasEl.height = viewport.height;
      canvasEl.width = viewport.width;
      // if previous render isn't done yet, cancel it
      if (renderTask.current) {
        renderTask.current.cancel();
        return;
      }
      renderTask.current = page.render({ canvasContext, viewport });
      return renderTask.current.promise.then(
        () => (renderTask.current = null),
        (reason: Error) => {
          renderTask.current = null;
          if (reason && reason.name === "RenderingCancelledException") {
            drawPDF(page);
          } else {
            setIsError(true);
          }
        }
      );
    };

    if (page) {
      drawPDF(page);
    }
  }, [canvasRef, page, open]);

  return { isError };
};
