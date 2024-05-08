import type { PDFLine } from "models/screenplay";
import { DEFAULT_SETTINGS } from "../../settings";
import { GenericParser } from "../generic-parser";

const getPDFLine = (
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

const centerX = DEFAULT_SETTINGS.X_CENTER_STARTING_POSITION + 1;
const rightX = DEFAULT_SETTINGS.X_RIGHT_STARTING_POSITION + 1;
const leftX = DEFAULT_SETTINGS.X_CENTER_STARTING_POSITION - 60;
const yCenter = DEFAULT_SETTINGS.Y_CENTER_STARTING_POSITION - 1;
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
        getPDFLine({}, { x: DEFAULT_SETTINGS.X_RIGHT_STARTING_POSITION + 10 })
      )
    ).toBeTruthy();
  });
  it("return false if the line is not on the far right of the page", () => {
    expect(
      parser.isPageNumber(
        getPDFLine({}, { x: DEFAULT_SETTINGS.X_RIGHT_STARTING_POSITION - 10 })
      )
    ).toBeFalsy();
  });
});

describe("isNewActTag", () => {
  it("return true if the line is a new act tag", () => {
    expect(
      parser.isNewActTag(getPDFLine({ str: "ACT ONE" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " ACT ONE" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " act one" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: "SCENE ONE" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " SCENE ONE" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " act one" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: "COLD OPEN" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " COLD OPEN" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " cold open" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: "TAG" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " TAG" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " tag" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: "OUTRO" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " OUTRO" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isNewActTag(getPDFLine({ str: " outro" }, { x: centerX }))
    ).toBeTruthy();
  });
  it("return false if the line is not a new act tag", () => {
    expect(parser.isNewActTag(getPDFLine({ str: "GREAT ACT" }))).toBeFalsy();
    expect(parser.isNewActTag(getPDFLine({ str: "hello world" }))).toBeFalsy();
    expect(
      parser.isNewActTag(
        getPDFLine({ str: "cold wheather outside." }, { x: leftX })
      )
    ).toBeFalsy();
    expect(
      parser.isNewActTag(
        getPDFLine({ str: "act as a real businessman" }, { x: leftX })
      )
    ).toBeFalsy();
  });
});

describe("isActionLine", () => {
  it("return true if the line is an action line", () => {
    expect(parser.isActionLine(getPDFLine({ str: "GREAT ACT" }))).toBeTruthy();
    expect(
      parser.isActionLine(getPDFLine({ str: "hello world" }))
    ).toBeTruthy();
    expect(
      parser.isActionLine(
        getPDFLine({ str: "cold wheather outside." }, { x: leftX })
      )
    ).toBeTruthy();
    expect(
      parser.isActionLine(
        getPDFLine({ str: "act as a real businessman" }, { x: leftX })
      )
    ).toBeTruthy();
  });
  it("return false if the line is not an action line", () => {
    expect(
      parser.isActionLine(getPDFLine({ str: "2" }, { x: rightX }))
    ).toBeFalsy();
    expect(
      parser.isActionLine(getPDFLine({ str: "ACT ONE" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isActionLine(getPDFLine({ str: "OUTRO" }, { x: centerX }))
    ).toBeFalsy();
  });
});

describe("isContDCharacter", () => {
  it("returns true if the character keeps speaking between actions", () => {
    expect(
      parser.isContDCharacter(getPDFLine({ str: "LOUIE (CONT'D)" }))
    ).toBeTruthy();
    expect(
      parser.isContDCharacter(getPDFLine({ str: "SUSAN MONHAGAN (CONT’D)" }))
    ).toBeTruthy();
    expect(
      parser.isContDCharacter(getPDFLine({ str: "JOHN DOE (CONT'D)" }))
    ).toBeTruthy();
  });
  it("returns false if the character doesn't keep speaking between actions", () => {
    expect(parser.isContDCharacter(getPDFLine({ str: "LOUIE" }))).toBeFalsy();
    expect(
      parser.isContDCharacter(getPDFLine({ str: "SUSAN MONHAGAN" }))
    ).toBeFalsy();
    expect(
      parser.isContDCharacter(getPDFLine({ str: "JOHN DOE" }))
    ).toBeFalsy();
  });
});

describe("getCharacterWithoutParenthesis", () => {
  it("return the character without parenthesis", () => {
    expect(parser.getCharacterWithoutParenthesis("LOUIE (CONT'D)")).toEqual(
      "LOUIE"
    );
    expect(
      parser.getCharacterWithoutParenthesis("SUSAN MONHAGAN (CONT’D)")
    ).toEqual("SUSAN MONHAGAN");
    expect(parser.getCharacterWithoutParenthesis("JOHN DOE (V.O)")).toEqual(
      "JOHN DOE"
    );
  });
});

// isUnscriptedPage
// isSceneSlug
// isCharacter
// isDialog
// getPopularWords
// getAct
// isPageNumber
// getValidSlug
