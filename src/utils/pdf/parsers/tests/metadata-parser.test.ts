import { MetadataParser } from "../metadata-parser";
import { centerX, leftX, getPDFLine } from "./mock";

const pageA = [
  getPDFLine({ str: "" }),
  getPDFLine({ str: "SLICKED", height: 300 }, { x: centerX }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "written by" }, { x: centerX }),
  getPDFLine({ str: "Roaring Twenties Studio" }, { x: centerX }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "hello@roaring-twenties-studio.com" }, { x: leftX }),
  getPDFLine({ str: "(555) 555-1234" }, { x: leftX }),
];

const pageB = [
  getPDFLine({ str: "" }),
  getPDFLine({ str: "French", height: 300 }, { x: centerX }),
  getPDFLine({ str: "Beauty", height: 300 }, { x: centerX }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "by" }, { x: centerX }),
  getPDFLine({ str: "John Doe &" }, { x: centerX }),
  getPDFLine({ str: "John Smith" }, { x: centerX }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }, { x: leftX }),
  getPDFLine({ str: "" }, { x: leftX }),
];

const pageC = [
  getPDFLine({ str: "" }),
  getPDFLine({ str: "Super Deep" }, { x: centerX }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "wrote by" }, { x: centerX }),
  getPDFLine({ str: "John Doe and" }, { x: centerX }),
  getPDFLine({ str: "Mildred Smith" }, { x: centerX }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "" }),
  getPDFLine({ str: "+33-6-00-00-00-00" }, { x: leftX }),
];

const parser = new MetadataParser();

describe("getEmail", () => {
  it("return the email in the title page", () => {
    expect(parser.getMetadata(pageA, 1).email).toEqual(
      "hello@roaring-twenties-studio.com"
    );
  });
  it("return an empty string if there is no email", () => {
    expect(parser.getMetadata(pageB, 1).email).toEqual("");
  });
});

describe("getPhone", () => {
  it("return the phone in the title page", () => {
    expect(parser.getMetadata(pageA, 1).phone).toEqual("(555) 555-1234");
    expect(parser.getMetadata(pageC, 1).phone).toEqual("+33-6-00-00-00-00");
  });
  it("return an empty string if there is no phone", () => {
    expect(parser.getMetadata(pageB, 1).phone).toEqual("");
  });
});

describe("getWrittenBy", () => {
  it("return a single author", () => {
    expect(parser.getMetadata(pageA, 1).writtenBy).toEqual(
      "Roaring Twenties Studio"
    );
  });
  it("return several authors", () => {
    expect(parser.getMetadata(pageB, 1).writtenBy).toEqual(
      "John Doe & John Smith"
    );
    expect(parser.getMetadata(pageC, 1).writtenBy).toEqual(
      "John Doe & Mildred Smith"
    );
  });
});

describe("getScriptTitle", () => {
  it("consider the lines heighest lines as the title", () => {
    expect(parser.getMetadata(pageA, 1).title).toEqual("SLICKED");
    expect(parser.getMetadata(pageB, 1).title).toEqual("French Beauty");
  });
  it("creturn an empty string if all the lines have the same height", () => {
    expect(parser.getMetadata(pageC, 1).title).toEqual("");
  });
});
