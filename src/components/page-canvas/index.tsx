import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import Reset from "components/icons/reset.svg";
import InputRange from "components/input-range";
import type { Settings } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  onChangeLine: (line: keyof Settings, value: number) => void;
  onReset: () => void;
  setPreview: (preview: "page" | "title") => void;
  settings: Settings;
  preview: "page" | "title";
  error: boolean;
}

function PageCanvas(
  { onChangeLine, onReset, setPreview, settings, preview, error }: IProps,
  ref: React.MutableRefObject<HTMLCanvasElement>
) {
  const linesRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const xC = settings.X_CENTER_STARTING_POSITION / 2;
      const xR = settings.X_RIGHT_STARTING_POSITION / 2;
      const yC = settings.Y_CENTER_STARTING_POSITION / 5.6;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (preview === "page") {
        // draw X_CENTER_STARTING_POSITION line
        ctx.beginPath();
        ctx.strokeStyle = "#7794b9";
        ctx.moveTo(xC, 0);
        ctx.lineTo(xC, ctx.canvas.width);
        ctx.stroke();
        // draw X_RIGHT_STARTING_POSITION line
        ctx.beginPath();
        ctx.strokeStyle = "#ff9800";
        ctx.moveTo(xR, 0);
        ctx.lineTo(xR, ctx.canvas.width);
        ctx.stroke();
      }
      // draw Y_CENTER_STARTING_POSITION line
      if (preview === "title") {
        ctx.beginPath();
        ctx.moveTo(0, yC);
        ctx.strokeStyle = "#d92534";
        ctx.lineTo(ctx.canvas.width, yC);
        ctx.stroke();
        ctx.fill();
      }
    },
    [
      preview,
      settings.X_CENTER_STARTING_POSITION,
      settings.X_RIGHT_STARTING_POSITION,
      settings.Y_CENTER_STARTING_POSITION,
    ]
  );

  useEffect(() => {
    const canvas = linesRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      draw(context);
    }
  }, [draw]);

  return (
    <div className={styles.root}>
      <InputRange
        min={0}
        max={595}
        value={settings.X_CENTER_STARTING_POSITION}
        label="Starting point of the dialogs"
        color="blue"
        onChange={(value) => onChangeLine("X_CENTER_STARTING_POSITION", value)}
        onFocus={() => setPreview("page")}
      />
      <InputRange
        min={0}
        max={595}
        value={settings.X_RIGHT_STARTING_POSITION}
        label="Ending point of the dialogs"
        color="orange"
        onChange={(value) => onChangeLine("X_RIGHT_STARTING_POSITION", value)}
        onFocus={() => setPreview("page")}
      />
      <InputRange
        min={0}
        max={842}
        value={settings.Y_CENTER_STARTING_POSITION}
        label="Space before script title"
        color="red"
        onChange={(value) => onChangeLine("Y_CENTER_STARTING_POSITION", value)}
        onFocus={() => setPreview("title")}
      />

      <button className={styles.reset} onClick={onReset}>
        <Reset width={12} height={12} />
        <span>reset</span>
      </button>
      <div className={styles.canvasSection}>
        {error ? (
          <p className={styles.error}>The PDF cannot be displayed</p>
        ) : (
          <div className={styles.canvasWrapper}>
            <canvas className={styles.canvasLines} ref={linesRef} />
            <canvas
              ref={ref}
              width={150}
              height={200}
              className={styles.canvasPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default forwardRef(PageCanvas);
