import { Settings } from "models/screenplay";

export const DEFAULT_SETTINGS: Settings = {
  X_CENTER_STARTING_POSITION: 172,
  X_RIGHT_STARTING_POSITION: 450, // PDF left X: 0, right X: 595
  Y_CENTER_STARTING_POSITION: 620, // PDF bottom Y: 0, top Y: 842,
  forceLineBreak: false,
  excludedCharacters: [],
};
