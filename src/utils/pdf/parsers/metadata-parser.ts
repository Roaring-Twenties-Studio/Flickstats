import { MetaData, PDFLine, IMetadataParser } from "models/screenplay";

const MINIMUM_PHONE_NUMBER_LENGTH = 8;

export class MetadataParser implements IMetadataParser {
  private getScriptTitle(pageLines: PDFLine[]): string {
    const maxHeight = Math.max(...pageLines.map((line) => line.height));
    let title = "";
    const validLines = pageLines.filter((line) => !!line.str.replace(/ /g, ""));
    const titleLines = validLines.filter((line) => line.height === maxHeight);
    // edgecase: if the title is written with the same font-size than the text, we can't know which lines are the title
    // so we return an empty string and will use the pdf title instead.
    if (validLines.length === titleLines.length) {
      return title;
    }
    titleLines.forEach((line) => {
      title += title.length > 0 ? ` ${line.str.trim()}` : line.str;
    });
    return title;
  }

  private isWrittenByLine(lineStr: string): boolean {
    const _str = lineStr.toLowerCase();
    return (
      _str.includes("written by") ||
      _str.includes("wrote by") ||
      _str.includes("screenplay by") ||
      _str.includes("script by") ||
      _str === "by"
    );
  }

  private getOneLineAuthor(writtenByLine: string): string {
    const authorName = writtenByLine
      .toLowerCase()
      .split(" ")
      .filter((word) => word !== "written" && word !== "wrote" && word !== "by")
      .join(" ");
    if (
      !writtenByLine.endsWith("&") &&
      !writtenByLine.endsWith("and") &&
      authorName.length > 0
    ) {
      return authorName;
    }
    return "";
  }

  private hasNextAuthor(nextLineStr: string, currentLineStr: string) {
    if (!nextLineStr) return false;
    const cleanLine = currentLineStr.trim();
    return (
      cleanLine.endsWith("&") ||
      cleanLine.endsWith("and") ||
      nextLineStr.includes("&") ||
      nextLineStr.includes("and")
    );
  }

  private getManyLinesAuthors(
    pageLines: PDFLine[],
    writtenByIndex: number
  ): string {
    let authors = "";
    const mainLine = pageLines[writtenByIndex].str.trim();
    if (mainLine.endsWith("&") || mainLine.endsWith("and")) {
      authors += mainLine
        .split(" ")
        .filter((word) => {
          const _word = word.toLowerCase();
          return (
            _word !== "written" &&
            _word !== "wrote" &&
            _word !== "by" &&
            _word !== "&" &&
            _word !== "and"
          );
        })
        .join(" ");
    }
    const remainingLines = pageLines.splice(writtenByIndex + 1);
    remainingLines.some((line, i) => {
      if (
        line.str.toLowerCase().trim() === "&" ||
        line.str.toLowerCase().trim() === "and"
      ) {
        return false;
      }
      const hasNextAuthor = this.hasNextAuthor(
        remainingLines[i + 1]?.str,
        line.str
      );
      const author = hasNextAuthor
        ? line.str
            .split(" ")
            .filter((word) => word.toLowerCase() !== "and" && word !== "&")
            .join(" ")
        : line.str;
      if (author) {
        authors = authors.length > 0 ? `${authors} & ${author}` : author;
      }
      if (hasNextAuthor) {
        return false;
      }
      return true;
    });

    return authors;
  }

  private getWrittenBy(pageLines: PDFLine[]): string {
    const validLines = pageLines.filter((line) => !!line.str.replace(/ /g, ""));
    const writtenByIndex = validLines.findIndex((line) =>
      this.isWrittenByLine(line.str)
    );
    if (writtenByIndex === -1) {
      return "";
    }
    const writtenByLine = validLines[writtenByIndex].str;
    const oneLineAuthor = this.getOneLineAuthor(writtenByLine);
    if (oneLineAuthor) {
      return oneLineAuthor;
    }
    return this.getManyLinesAuthors(validLines, writtenByIndex);
  }

  private getEmail(pageLines: PDFLine[]): string {
    const email = pageLines.find((line) =>
      /^[a-z0-9.-]{1,64}@[a-z0-9.-]{1,64}$/i.test(line.str)
    );
    if (email) {
      return email.str;
    }
    return "";
  }

  private getPhone(pageLines: PDFLine[]): string {
    const phone = pageLines.find((line) =>
      /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g.test(line.str)
    );
    if (phone && phone?.str?.length > MINIMUM_PHONE_NUMBER_LENGTH) {
      return phone.str;
    }
    return "";
  }

  public getMetadata(pageLines: PDFLine[], pageNumber: number): MetaData {
    return {
      writtenBy: this.getWrittenBy(pageLines) || "",
      title: this.getScriptTitle(pageLines) || "",
      email: this.getEmail(pageLines) || "",
      phone: this.getPhone(pageLines) || "",
      pages: 0,
      titlePage: pageNumber,
      dialogPage: undefined,
    };
  }
}
