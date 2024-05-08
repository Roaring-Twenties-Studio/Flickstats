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
//const yCenter = DEFAULT_SETTINGS.Y_CENTER_STARTING_POSITION - 1;
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

describe("isCharacter", () => {
  it("return true if the line is a character", () => {
    expect(
      parser.isCharacter(getPDFLine({ str: "LOUIE" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isCharacter(getPDFLine({ str: "LOUIE MARTINI" }, { x: centerX }))
    ).toBeTruthy();
    expect(
      parser.isCharacter(
        getPDFLine({ str: "MILDRED (CONT'D)" }, { x: centerX })
      )
    ).toBeTruthy();
    expect(
      parser.isCharacter(getPDFLine({ str: "FRANK (V.O)" }, { x: centerX }))
    ).toBeTruthy();
  });
  it("return false if the line is not a character", () => {
    expect(
      parser.isCharacter(getPDFLine({ str: "LOUIE" }, { x: leftX }))
    ).toBeFalsy();
    expect(
      parser.isCharacter(getPDFLine({ str: "2" }, { x: rightX }))
    ).toBeFalsy();
    expect(
      parser.isCharacter(
        getPDFLine({ str: "Paris, in the dead of winter." }, { x: leftX })
      )
    ).toBeFalsy();
    expect(
      parser.isCharacter(getPDFLine({ str: "Louie" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isCharacter(getPDFLine({ str: "ACT ONE" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isCharacter(getPDFLine({ str: "OUTRO" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isCharacter(getPDFLine({ str: "MILDRED" }, { x: leftX }))
    ).toBeFalsy();
    expect(
      parser.isCharacter(getPDFLine({ str: "MILDRED!" }, { x: centerX }))
    ).toBeFalsy();
  });
  it("return false if the character has been excluded", () => {
    const customParser = new GenericParser({
      ...DEFAULT_SETTINGS,
      excludedCharacters: ["LOUIE"],
    });
    expect(
      customParser.isCharacter(getPDFLine({ str: "LOUIE" }, { x: centerX }))
    ).toBeFalsy();
  });
});

describe("isPageNumber", () => {
  it("return true if the line is a page number", () => {
    expect(
      parser.isPageNumber(getPDFLine({ str: "23" }, { x: rightX }))
    ).toBeTruthy();
    expect(
      parser.isPageNumber(getPDFLine({ str: "p. 23" }, { x: rightX }))
    ).toBeTruthy();
    expect(
      parser.isPageNumber(getPDFLine({ str: "page 23" }, { x: rightX }))
    ).toBeTruthy();
  });
  it("return false if the line is a not page number", () => {
    expect(
      parser.isPageNumber(getPDFLine({ str: "23" }, { x: leftX }))
    ).toBeFalsy();
    expect(
      parser.isPageNumber(getPDFLine({ str: "23" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isPageNumber(getPDFLine({ str: "LOUIE" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isPageNumber(
        getPDFLine({ str: "Paris, in the dead of winter." }, { x: leftX })
      )
    ).toBeFalsy();
    expect(
      parser.isPageNumber(getPDFLine({ str: "ACT ONE" }, { x: centerX }))
    ).toBeFalsy();
  });
});

describe("isSceneSlug", () => {
  it("return true if the line is a scene slug", () => {
    expect(
      parser.isSceneSlug(getPDFLine({ str: "INT. LOUIE'S HOUSE - NIGHT" }))
    ).toBeTruthy();
    expect(
      parser.isSceneSlug(getPDFLine({ str: "EXT. LOUIE'S HOUSE" }))
    ).toBeTruthy();
    expect(
      parser.isSceneSlug(getPDFLine({ str: " INT. VINEYARD - DUSK" }))
    ).toBeTruthy();
  });
  it("return false if the line is not a scene slug", () => {
    expect(
      parser.isSceneSlug(getPDFLine({ str: "LOUIE'S HOUSE" }))
    ).toBeFalsy();
    expect(
      parser.isSceneSlug(getPDFLine({ str: "Paris, in the dead of winter." }))
    ).toBeFalsy();
    expect(parser.isSceneSlug(getPDFLine({ str: "ACT ONE" }))).toBeFalsy();
    expect(
      parser.isSceneSlug(
        getPDFLine({ str: " INT. VINEYARD - DUSK" }, { x: centerX })
      )
    ).toBeFalsy();
    expect(
      parser.isSceneSlug(getPDFLine({ str: "23" }, { x: rightX }))
    ).toBeFalsy();
    expect(
      parser.isSceneSlug(getPDFLine({ str: "LOUIE" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isSceneSlug(
        getPDFLine({ str: "So, I told her to go to Martha's" }, { x: centerX })
      )
    ).toBeFalsy();
  });
});

describe("isDialog", () => {
  it("return true if the line is a dialog", () => {
    expect(
      parser.isDialog(
        getPDFLine({ str: "So, I told her to go to Martha's" }, { x: centerX })
      )
    ).toBeTruthy();
    expect(
      parser.isDialog(
        getPDFLine({ str: "Alright, alright, alright." }, { x: centerX })
      )
    ).toBeTruthy();
  });
  it("return false if the line is not a dialog", () => {
    expect(
      parser.isDialog(getPDFLine({ str: "Paris, in the dead of winter." }))
    ).toBeFalsy();
    expect(
      parser.isDialog(
        getPDFLine({ str: "So, I told her to go to Martha's" }, { x: leftX })
      )
    ).toBeFalsy();
    expect(
      parser.isDialog(
        getPDFLine({ str: "So, I told her to go to Martha's" }, { x: rightX })
      )
    ).toBeFalsy();
    expect(
      parser.isDialog(getPDFLine({ str: "ACT ONE" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isDialog(getPDFLine({ str: "(beat)" }, { x: centerX }))
    ).toBeFalsy();
    expect(
      parser.isDialog(getPDFLine({ str: "OUTRO" }, { x: centerX }))
    ).toBeFalsy();
  });
});

describe("isUnscriptedPage", () => {
  it("return true if the page only contains text", () => {
    expect(
      parser.isUnscriptedPage([
        getPDFLine({ str: "this story has been written" }),
        getPDFLine({ str: "in Madrid, while watching a" }),
        getPDFLine({ str: "football game." }),
      ])
    ).toBeTruthy();
  });
  it("return false if the page doesn't only contain text", () => {
    expect(
      parser.isUnscriptedPage([
        getPDFLine({ str: "INT. MOTEL - NIGHT" }),
        getPDFLine({
          str: "In the dark of the night, a mysterious man appears.",
        }),
      ])
    ).toBeFalsy();
  });
});

describe("getPopularWords", () => {
  it("return a formated and sorted word list", () => {
    expect(
      parser.getPopularWords({ winter: 6, win: 1, read: 2 })
    ).toStrictEqual([
      { text: "winter", value: 6 },
      { text: "read", value: 2 },
      { text: "win", value: 1 },
    ]);
  });
});

describe("getValidSlug", () => {
  it("return the scene slug if it's already correct", () => {
    expect(
      parser.getValidSlug(
        [
          getPDFLine({ str: "INT. MOTEL - NIGHT" }),
          getPDFLine({ str: "Dim light and nasty bugs." }),
        ],
        0
      )
    ).toEqual("INT. MOTEL - NIGHT");
  });
  it("reconstruct the scene slug if it's cut in several lines", () => {
    expect(
      parser.getValidSlug(
        [
          getPDFLine({ str: "INT." }),
          getPDFLine({ str: "" }),
          getPDFLine({ str: "MOTEL - NIGHT" }),
          getPDFLine({ str: "Dim light and nasty bugs." }),
        ],
        0
      )
    ).toEqual("INT. MOTEL - NIGHT");
  });
});

describe("getAct", () => {
  it("return the act if the page starts with a new act", () => {
    expect(
      parser.getAct([
        getPDFLine({ str: "COLD OPEN" }, { x: centerX }),
        getPDFLine({ str: "INT. MOTEL - NIGHT" }),
        getPDFLine({ str: "Dim light and nasty bugs." }),
      ])
    ).toEqual("COLD OPEN");
  });
  it("return an empty string if the page doesn't start with a new act", () => {
    expect(
      parser.getAct([
        getPDFLine({ str: "INT. MOTEL - NIGHT" }),
        getPDFLine({ str: "Dim light and nasty bugs." }),
      ])
    ).toEqual("");
  });
});
