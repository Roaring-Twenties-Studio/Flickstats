import type {
  PDFLine,
  Settings,
  IGenericParser,
  PopularWord,
} from "models/screenplay";

export class GenericParser implements IGenericParser {
  settings: Settings;
  constructor(settings: Settings) {
    this.settings = settings;
  }
  public getValidSlug(pageLines: PDFLine[], index: number): string {
    const slug = pageLines[index];
    if (slug.str !== "INT." && slug.str !== "EXT.") {
      return slug.str;
    }
    // if the scene slug is only "INT." or "EXT.", the rest of the line has been cut.
    // we retrieve it by finding the next uppercase string after INT. or EXT.
    // for performance, we start the find() after the current broken slug line
    const missingPart = pageLines
      .slice(index + 1, pageLines.length)
      .find(
        (line) => !this.isEmptyLine(line) && line.str.toUpperCase() === line.str
      );
    if (missingPart) {
      return `${slug.str} ${missingPart.str.trim()}`;
    }
    return slug.str;
  }

  public isPageNumber(pageLine: PDFLine): boolean {
    return pageLine.transform[4] >= this.settings.X_RIGHT_STARTING_POSITION;
  }

  public isNewActTag(pageLine: PDFLine): boolean {
    const str = pageLine?.str?.toUpperCase().trim();
    if (!str || !this.isLineCentered(pageLine)) return false;
    return (
      str.startsWith("ACT ") ||
      str.startsWith("SCENE ") ||
      str.startsWith("COLD ") ||
      str.startsWith("INTRO ") ||
      str === "TAG" ||
      str === "OUTRO"
    );
  }

  private isEndActTag(pageLine: PDFLine): boolean {
    const str = pageLine?.str?.toUpperCase().trim();
    if (!str || !this.isLineCentered(pageLine)) return false;
    return (
      str.startsWith("END OF ACT") ||
      str.startsWith("END OF SCENE") ||
      str.startsWith("END OF COLD OPEN") ||
      str.startsWith("END OF SHOW") ||
      str === "THE END"
    );
  }

  public isActionLine(pageLine: PDFLine): boolean {
    return (
      !this.isNewActTag(pageLine) &&
      !this.isEndActTag(pageLine) &&
      !this.isPageNumber(pageLine)
    );
  }

  public isContDCharacter(pageLine: PDFLine): boolean {
    const str = pageLine.str.trim().toUpperCase();
    return str.endsWith("(CONT’D)") || str.endsWith("(CONT'D)");
  }

  private isLineCentered(pageLine: PDFLine): boolean {
    return pageLine.transform[4] > this.settings.X_CENTER_STARTING_POSITION;
  }

  private isEmptyLine(pageLine: PDFLine): boolean {
    return pageLine.str === "\r" || pageLine.str.replace(/ /g, "").length === 0;
  }

  public getAct(pageLines: PDFLine[]): string {
    const validLines = pageLines.filter((line) => !!line.str.replace(/ /g, ""));
    if (validLines.length > 0) {
      const firstLine = validLines[0];
      if (this.isNewActTag(firstLine) && this.isLineCentered(firstLine)) {
        return firstLine.str;
      }
    }
    return "";
  }

  public getPopularWords(wordsList: Record<string, number>): PopularWord[] {
    return Object.entries(wordsList)
      .sort(([, a], [, b]) => (a > b ? -1 : 1))
      .splice(0, 50)
      .map(([word, value]) => ({ text: word, value }));
  }

  // We can't confuse a dialog with a character, even if the dialog is in all caps,
  // because the parsers check if the line is a character before they check if it's a dialog.
  public isDialog(pageLine: PDFLine): boolean {
    return (
      this.isLineCentered(pageLine) &&
      !this.isNewActTag(pageLine) &&
      !this.isEndActTag(pageLine) &&
      !this.isPageNumber(pageLine) &&
      !pageLine.str.startsWith("(") &&
      !pageLine.str.startsWith(")")
    );
  }

  public isCharacter(pageLine: PDFLine): boolean {
    const strWithoutParenthesis = this.getCharacterWithoutParenthesis(
      pageLine.str
    );
    return (
      strWithoutParenthesis !== "" &&
      !this.hasPunctuation(strWithoutParenthesis) &&
      !this.isEmptyLine(pageLine) &&
      !this.isPageNumber(pageLine) &&
      this.isLineCentered(pageLine) &&
      !this.isParenthesisText(strWithoutParenthesis) &&
      !this.isNewActTag(pageLine) &&
      !this.isEndActTag(pageLine) &&
      strWithoutParenthesis !== "I" &&
      strWithoutParenthesis === strWithoutParenthesis.toUpperCase() &&
      !this.settings.excludedCharacters.includes(strWithoutParenthesis)
    );
  }

  public isSceneSlug(pageLine: PDFLine): boolean {
    const line = pageLine.str.toUpperCase().trim();
    const splittedLine = line.split(" ");
    const containsINTEXT =
      splittedLine.includes("INT.") || splittedLine.includes("EXT.");
    const startsWithINTEXT =
      line === pageLine.str.trim() &&
      (line.startsWith("INT.") || line.startsWith("EXT."));
    return (
      !this.isLineCentered(pageLine) && (containsINTEXT || startsWithINTEXT)
    );
  }

  public isUnscriptedPage(pageLines: PDFLine[]): boolean {
    return pageLines.every(
      (pageLine) => !this.isSceneSlug(pageLine) && !this.isCharacter(pageLine)
    );
  }

  private hasPunctuation(lineStr: string): boolean {
    return (
      lineStr.includes(".") ||
      lineStr.includes(":") ||
      lineStr.includes("?") ||
      lineStr.includes("--") ||
      lineStr.includes("!") ||
      lineStr === "-" ||
      lineStr.includes(",")
    );
  }

  private isParenthesisText(lineStr: string): boolean {
    return lineStr.includes("(") || lineStr.includes(")");
  }

  public getCharacterWithoutParenthesis(lineStr = ""): string {
    // remove parenthesis content AT THE END of the string
    // John Doe (V.O) => John Doe. John (CONT'D) => John
    // John (blabla) Doe => John (blabla) Doe
    return lineStr.trim().replace(/\s*\([^)]*\)$/, "");
  }

  private isContinousTag(lineStr: string): boolean {
    const line = lineStr.toUpperCase();
    return line === "(CONTINUED)" || line === "(MORE)";
  }

  // Once the title page has been found, the parsers skip the check for the next pages
  public isTitlePage(pageLines: PDFLine[]): boolean {
    // ignore the blank space lines
    const firstLine = pageLines.find((line) => !!line.str.replace(/ /g, ""));
    if (firstLine) {
      // sometimes (MORE) and (CONTINOUS) tags - at the bottom of the page - can appear at the top of the parsed lines (pdfjs bug)
      // since these tags will have a lower Y position that can trick isTitlePage(), we make sure not to consider these lines as a valid title line
      return (
        firstLine.transform[5] <= this.settings.Y_CENTER_STARTING_POSITION &&
        !this.isContinousTag(firstLine.str)
      );
    }
    return false;
  }
}
