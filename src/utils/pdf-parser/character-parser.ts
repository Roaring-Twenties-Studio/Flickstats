import {
  ParsedPage,
  PDFLine,
  Settings,
  ParsedCharacter,
  ICharacterParser,
} from "../../models/screenplay";
import * as PDFJS from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { GenericParser } from "./generic-parser";
import { COMMON_WORDS } from "./word-list";

export class CharacterParser implements ICharacterParser {
  currentScene: string;
  actionQuote: string;
  dialogQuote: string;
  firstDialogQuote: string;
  parser: GenericParser;
  pages: ParsedCharacter["pages"];
  currentPage: number;
  currentSpeaker: string;
  isDialogQuoteComplete: boolean;
  isFirstDialogQuoteComplete: boolean;
  isPrevLineDialog: boolean;
  character: string;
  firstScene: string;
  dialogWords: Record<string, number>;
  penalties: Record<string, number>;
  scenesPenalties: Record<string, number>;
  characterDialogsPenalties: Record<string, number>;
  isCharacterMentionnedInScene: boolean;
  isTitlePageParsed: boolean;
  settings: Settings;
  constructor(settings: Settings, character: string) {
    this.character = character;
    this.currentScene = "";
    this.actionQuote = "";
    this.dialogQuote = "";
    this.firstDialogQuote = "";
    this.isTitlePageParsed = false;
    this.isFirstDialogQuoteComplete = false;
    this.firstScene = "";
    this.pages = [];
    this.settings = settings;
    this.parser = new GenericParser(settings);
    this.currentPage = 0;
    this.currentSpeaker = "";
    this.isDialogQuoteComplete = false;
    this.isPrevLineDialog = false;
    this.isCharacterMentionnedInScene = false;
    this.dialogWords = {};
    this.penalties = { INT: 0, EXT: 0 };
    this.scenesPenalties = {};
    this.characterDialogsPenalties = {};
  }

  private getUniqueMentions(mention: "scenes" | "scenesPeriod") {
    return [
      ...new Set(this.pages.flatMap((page) => Object.keys(page[mention]))),
    ];
  }

  private getParsedCharacter(): ParsedCharacter {
    return {
      name: this.character,
      firstScene: this.firstScene,
      pages: this.pages,
      penalties: this.penalties,
      scenesPenalties: this.scenesPenalties,
      characterDialogsPenalties: this.characterDialogsPenalties,
      dialogVibe: this.parser.getPopularWords(this.dialogWords),
      dialogQuote: this.dialogQuote.replace(/\s+/g, " ").trim(), // remove extra empty spaces inside the sentence
      firstDialogQuote: this.firstDialogQuote.replace(/\s+/g, " ").trim(), // remove extra empty spaces inside the sentence
      labels: {
        pages: this.pages.map((page) => page.page),
        characters: [this.character],
        dialogLines: [this.character],
        dialogs: [this.character],
        actions: [this.character],
        presence: [this.character],
        scenes: this.getUniqueMentions("scenes"),
        scenesPeriod: this.getUniqueMentions("scenesPeriod"),
        scenesIntExt: ["INT", "EXT"],
      },
    };
  }

  private getFirstQuote(line: PDFLine) {
    // if a dialog snippet is available, there is no need to fetch a new snippet.
    if (this.isFirstDialogQuoteComplete) {
      null;
    } else {
      // if we are inside a dialog, add the line to the snippet
      if (this.isPrevLineDialog) {
        this.firstDialogQuote += " " + line.str;
      } else {
        // if we are in a new dialog (!isPreviousLineDialog)
        if (!this.isPrevLineDialog) {
          if (this.firstDialogQuote.length === 0) {
            this.firstDialogQuote = line.str;
          } else {
            this.isFirstDialogQuoteComplete = true;
          }
        }
      }
    }
  }

  private getDialogQuote(line: PDFLine) {
    if (!this.isFirstDialogQuoteComplete) {
      null;
    }
    // if a dialog snippet is available, there is no need to fetch a new snippet.
    else if (this.isDialogQuoteComplete) {
      null;
    } else {
      // if we are inside a dialog, add the line to the snippet
      if (this.isPrevLineDialog) {
        this.dialogQuote += " " + line.str;
      } else {
        // if we are in a new dialog (!isPreviousLineDialog)
        if (!this.isPrevLineDialog) {
          // replace the old snippet if it is too short, else mark it as completed
          if (this.dialogQuote.length < 50) {
            this.dialogQuote = line.str;
          } else {
            this.isDialogQuoteComplete = true;
          }
        }
      }
    }
  }

  private countScenes(
    scenes: ParsedPage["scenes"],
    scenesIntExt: ParsedPage["scenesIntExt"],
    scenesPeriod: ParsedPage["scenesPeriod"],
    extendsFromPrevPage = false // whether the scene is a continuity of the previous page
  ) {
    if (!this.currentScene) {
      return;
    }
    const splittedLine = this.currentScene.toUpperCase().split(/(?:,| )+/); // splits on "." and "-"

    const countCurrentScene = () => {
      if (this.currentScene in scenes) {
        scenes[this.currentScene]++;
        if (extendsFromPrevPage) {
          if (this.currentScene in this.scenesPenalties) {
            this.scenesPenalties[this.currentScene]--;
          } else {
            this.scenesPenalties[this.currentScene] = -1;
          }
        }
      } else {
        scenes[this.currentScene] = 1;
        if (extendsFromPrevPage) {
          if (this.currentScene in this.scenesPenalties) {
            this.scenesPenalties[this.currentScene]--;
          } else {
            this.scenesPenalties[this.currentScene] = -1;
          }
        }
      }
    };

    countCurrentScene();

    const countIntExt = (place: string) => {
      scenesIntExt[place]++;
      if (extendsFromPrevPage) {
        this.penalties[place]--;
      }
    };

    const countScenePeriod = (period: string) => {
      if (extendsFromPrevPage) {
        if (period in this.penalties) {
          this.penalties[period]--;
        } else {
          this.penalties[period] = -1;
        }
      }
      if (period in scenesPeriod) {
        scenesPeriod[period]++;
      } else {
        scenesPeriod[period] = 1;
      }
    };

    if (splittedLine.includes("INT.") || this.currentScene.startsWith("INT.")) {
      countIntExt("INT");
    }
    if (splittedLine.includes("EXT.") || this.currentScene.startsWith("EXT.")) {
      countIntExt("EXT");
    }
    if (splittedLine.includes("NIGHT")) {
      countScenePeriod("NIGHT");
    } else if (splittedLine.includes("DAY")) {
      countScenePeriod("DAY");
    } else if (splittedLine.includes("DAWN")) {
      countScenePeriod("DAWN");
    } else if (splittedLine.includes("MORNING")) {
      countScenePeriod("MORNING");
    } else if (splittedLine.includes("DUSK")) {
      countScenePeriod("DUSK");
    } else if (splittedLine.includes("AFTERNOON")) {
      countScenePeriod("AFTERNOON");
    } else if (splittedLine.includes("TWILIGHT")) {
      countScenePeriod("TWILIGHT");
    } else {
      return null;
    }
  }

  private countDialogWords(pageLine: PDFLine) {
    return pageLine.str
      .split(" ")
      .map((word) => word.replace(/[^\w\s']|_/g, "")) // remove useless puctation (.,!?, etc.)
      .filter((word) => !COMMON_WORDS.includes(word.toLowerCase()))
      .forEach((word) =>
        word in this.dialogWords
          ? this.dialogWords[word]++
          : (this.dialogWords[word] = 1)
      );
  }

  private parseCharacterPage(pageLines: PDFLine[]): void {
    try {
      const scenes: ParsedPage["scenes"] = {};
      const scenesIntExt: ParsedPage["scenesIntExt"] = { INT: 0, EXT: 0 };
      const scenesPeriod: ParsedPage["scenesPeriod"] = {};
      let pageActions = 0;
      let pageDialogs = 0;
      let isFirstLineParsed = false;
      if (!this.isTitlePageParsed) {
        if (this.parser.isTitlePage(pageLines)) {
          this.isTitlePageParsed = true;
          return;
        }
      }
      if (this.parser.isUnscriptedPage(pageLines)) {
        return;
      }
      for (let i = 0; i < pageLines.length; i++) {
        const line = pageLines[i];
        if (this.parser.isPageNumber(line)) {
          continue;
        }
        if (this.parser.isSceneSlug(line)) {
          this.currentScene = line.str;
          this.isCharacterMentionnedInScene = false;
          this.isPrevLineDialog = false;
          isFirstLineParsed = true;
        } else if (this.parser.isCharacter(line)) {
          this.currentSpeaker = this.parser
            .getCharacterWithoutParenthesis(line.str)
            .toLowerCase();
          this.isPrevLineDialog = false;
          // if character is already mentioned in scene && scene is continuing on this page, add the scene to the page with a penalty
          if (this.isCharacterMentionnedInScene && !isFirstLineParsed) {
            this.countScenes(scenes, scenesIntExt, scenesPeriod, true);
          }
          if (this.currentSpeaker === this.character.toLowerCase()) {
            pageDialogs++;
            // if the character is cont'd, his previous dialog is not over. So let's add it to charactersDialogs to display a valid occurence over time
            // but also add a penalty to not count it when calculating his total dialogs.
            if (this.parser.isContDCharacter(line)) {
              const _character = this.character.toUpperCase();
              _character in this.characterDialogsPenalties
                ? this.characterDialogsPenalties[_character]++
                : (this.characterDialogsPenalties[_character] = 1);
            }
            if (!this.isCharacterMentionnedInScene) {
              if (!this.firstScene) {
                this.firstScene = this.currentScene;
              }
              this.countScenes(scenes, scenesIntExt, scenesPeriod);
              this.isCharacterMentionnedInScene = true;
            }
          }
          isFirstLineParsed = true;
        } else if (this.parser.isDialog(line)) {
          if (this.isCharacterMentionnedInScene && !isFirstLineParsed) {
            this.countScenes(scenes, scenesIntExt, scenesPeriod, true);
          }
          if (this.currentSpeaker === this.character.toLowerCase()) {
            if (!this.isCharacterMentionnedInScene) {
              if (!this.firstScene) {
                this.firstScene = this.currentScene;
              }
              this.countScenes(scenes, scenesIntExt, scenesPeriod);
              this.isCharacterMentionnedInScene = true;
            }
            this.countDialogWords(line);
            this.getFirstQuote(line);
            this.getDialogQuote(line);
            this.isPrevLineDialog = true;
          }
          isFirstLineParsed = true;
        } else if (this.parser.isNewActTag(line)) {
          isFirstLineParsed = true;
          this.isCharacterMentionnedInScene = false;
          this.currentScene = null;
        } else {
          if (this.isCharacterMentionnedInScene && !isFirstLineParsed) {
            this.countScenes(scenes, scenesIntExt, scenesPeriod, true);
          }
          // check if character is mentionned in the action line
          if (line.str.toLowerCase().includes(this.character.toLowerCase())) {
            if (!this.isCharacterMentionnedInScene) {
              if (!this.firstScene) {
                this.firstScene = this.currentScene;
              }
              this.countScenes(scenes, scenesIntExt, scenesPeriod);
              this.isCharacterMentionnedInScene = true;
            }
            pageActions++;
          }
          this.isPrevLineDialog = false;
          isFirstLineParsed = true;
        }
      }
      //end of page parsing
      this.currentPage++;
      this.pages.push({
        page: this.currentPage,
        scenes: scenes,
        scenesIntExt,
        scenesPeriod,
        dialogs: { [this.character]: pageDialogs },
        presence: { [this.character]: pageActions + pageDialogs },
        actions: { [this.character]: pageActions },
      });
    } catch (err) {
      throw new Error(err as string);
    }
  }

  public async parseCharacter(pdfPath: Uint8Array): Promise<ParsedCharacter> {
    try {
      PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const doc = await PDFJS.getDocument(pdfPath).promise;

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const data = await page.getTextContent({
          disableCombineTextItems: this.settings.forceLineBreak,
        });
        this.parseCharacterPage(data.items as PDFLine[]);
      }
      return this.getParsedCharacter();
    } catch (err) {
      return err;
    }
  }
}
