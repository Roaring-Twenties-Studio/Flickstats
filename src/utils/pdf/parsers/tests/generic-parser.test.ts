import type { PDFLine } from "models/screenplay";
import { DEFAULT_SETTINGS } from "../../settings";
import { GenericParser } from "../generic-parser";

const getPDFLine = (line: Partial<PDFLine>): PDFLine => ({
  str: "",
  dir: "",
  transform: [0, 0, 0, 0, 0, 100], // [_, _, _, _, _, x, y]
  width: 100,
  height: 70,
  fontName: "",
  hasEOL: false,
  ...line,
});

const parser = new GenericParser(DEFAULT_SETTINGS);
describe("GenericParser", () => {
  it("receive the correct settings", () => {
    const customSettings = {
      ...DEFAULT_SETTINGS,
      Y_CENTER_STARTING_POSITION: 9,
      forceLineBreak: true,
      excludedCharacters: ["joe"],
    };
    expect(parser.settings).toStrictEqual(DEFAULT_SETTINGS);
    expect(new GenericParser(customSettings).settings).toStrictEqual(
      customSettings
    );
  });
});

describe("isPageNumber", () => {
  it("return true if the line is on the far right of the page", () => {
    expect(
      parser.isPageNumber(
        getPDFLine({
          transform: [
            0,
            0,
            0,
            0,
            DEFAULT_SETTINGS.X_RIGHT_STARTING_POSITION + 10,
            100,
          ],
        })
      )
    ).toBeTruthy();
  });
  it("return false if the line is not on the far right of the page", () => {
    expect(
      parser.isPageNumber(
        getPDFLine({
          transform: [
            0,
            0,
            0,
            0,
            DEFAULT_SETTINGS.X_RIGHT_STARTING_POSITION - 10,
            100,
          ],
        })
      )
    ).toBeFalsy();
  });
});
