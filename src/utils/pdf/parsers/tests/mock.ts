import type { PDFLine } from "models/screenplay";
import { DEFAULT_SETTINGS } from "../../settings";

export const getPDFLine = (
  line: Partial<PDFLine>,
  position: { x?: number; y?: number } = { x: 0, y: 100 }
): PDFLine => ({
  str: "",
  dir: "",
  transform: [0, 0, 0, 0, position.x || 0, position.y || 100], // [_, _, _, _, _, x, y]
  width: 100,
  height: 70,
  fontName: "",
  hasEOL: false,
  ...line,
});

export const centerX = DEFAULT_SETTINGS.X_CENTER_STARTING_POSITION + 1;
export const rightX = DEFAULT_SETTINGS.X_RIGHT_STARTING_POSITION + 1;
export const leftX = DEFAULT_SETTINGS.X_CENTER_STARTING_POSITION - 60;
