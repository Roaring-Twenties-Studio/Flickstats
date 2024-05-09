import * as PDFJS from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import {
  ParsedPage,
  MetaData,
  ParsedScreenplay,
  PDFLine,
  Settings,
  IScreenplayParser,
  IMasterScreenplay,
  IMetadataParser,
} from "models/screenplay";
import { GenericParser } from "./generic-parser";
import { COMMON_WORDS } from "../word-list";
import { MetadataParser } from "./metadata-parser";

export class ScreenplayParser implements IScreenplayParser {
  actionWords: Record<string, number>;
  dialogWords: Record<string, number>;
  firstPageAction: string;
  firstScene: string;
  scenes: ParsedPage["scenes"];
  scenesIntExt: { INT: number; EXT: number };
  scenesPeriod: { [period: string]: number };
  pages: ParsedPage[];
  currentPage: number;
  readPage: number;
  metadata: MetaData;
  metadataParser: IMetadataParser;
  parser: GenericParser;
  currentScene: string;
  currentSpeaker = "";
  penalties: Record<string, number>;
  scenesPenalties: Record<string, number>;
  charactersDialogsPenalties: Record<string, number>;
  settings: Settings;
  constructor(settings: Settings) {
    this.settings = settings;
    this.parser = new GenericParser(settings);
    this.metadataParser = new MetadataParser();
    this.firstScene = "";
    this.dialogWords = {};
    this.actionWords = {};
    this.firstPageAction = "";
    this.pages = [];
    this.currentPage = 0;
    this.readPage = 0;
    this.currentScene = "";
    this.currentSpeaker = "";
    this.penalties = { INT: 0, EXT: 0 };
    this.scenesPenalties = {};
    this.charactersDialogsPenalties = {};
    this.metadata = {
      writtenBy: "",
      title: "",
      email: "",
      phone: "",
      pages: 0,
      titlePage: undefined,
      dialogPage: undefined,
    };
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

  private countActionWords(pageLine: PDFLine) {
    return pageLine.str
      .split(" ")
      .map((word) => word.replace(/[^\w\s']|_/g, "")) // remove useless puctation (.,!?, etc.)
      .filter((word) => !COMMON_WORDS.includes(word.toLowerCase()))
      .forEach((word) =>
        word in this.actionWords
          ? this.actionWords[word]++
          : (this.actionWords[word] = 1)
      );
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
          this.penalties[period] = 0;
        }
      }
      if (scenesPeriod[period] in scenesPeriod) {
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

  private getPercentage(value: number, against: number): number {
    return Number(((value * 100) / (value + against)).toFixed(2));
  }

  private parsePage(pageLines: PDFLine[]): void {
    try {
      const scenes: ParsedPage["scenes"] = {};
      const scenesIntExt: ParsedPage["scenesIntExt"] = { INT: 0, EXT: 0 };
      const scenesPeriod: ParsedPage["scenesPeriod"] = {};
      const charactersDialogs: ParsedPage["charactersDialogs"] = {};
      let dialogLength = 0;
      let actionLength = 0;
      let isFirstLineParsed = false;
      // if there is no titlePage (preview) yet, we can check whether the page is a title page
      // if there is already one, no need to check again.
      if (!this.metadata.titlePage) {
        if (this.parser.isTitlePage(pageLines)) {
          this.metadata = this.metadataParser.getMetadata(
            pageLines,
            this.readPage + 1 // the readPage is always inferior to the current iteration, so +1
          );
          this.readPage++;
          return;
        }
      }
      // if we have not seen any dialog, action or scene in the script yet, we're probably reading a note page.
      // we make sure of it by checking there are no character nor scene in this page.
      // If there is only text, without any scene nor character, we are on a note page.
      if (
        !this.metadata.dialogPage &&
        !this.firstScene &&
        !this.firstPageAction
      ) {
        if (this.parser.isUnscriptedPage(pageLines)) {
          this.readPage++;
          return;
        }
      }
      for (let i = 0; i < pageLines.length; i++) {
        const line = pageLines[i];
        if (this.parser.isPageNumber(line)) {
          continue;
        }
        if (this.parser.isSceneSlug(line)) {
          if (!this.firstScene) {
            this.firstScene = line.str;
          }
          const validSlug = this.parser.getValidSlug(pageLines, i);
          this.currentScene = validSlug;
          this.countScenes(scenes, scenesIntExt, scenesPeriod);
          isFirstLineParsed = true;
        } else if (this.parser.isCharacter(line)) {
          if (!isFirstLineParsed) {
            // if the first line of the page is not a scene slug, it means we're still in the previous scene
            // so we add + 1 to the page scene counter.
            // but we also add a penalty to the final scene total. Indeed, if a scene overlaps on two pages, it will be counted twice to show
            // a proper data visualization, but the real total of scene would only be 1.
            this.countScenes(scenes, scenesIntExt, scenesPeriod, true);
            isFirstLineParsed = true;
          }
          const character = this.parser.getCharacterWithoutParenthesis(
            line.str
          );
          // if a character is cont'd, his previous dialog is not over. So let's add it to charactersDialogs to display a valid occurence over time
          // but also add a penalty to not count it when calculating his total dialogs.
          if (this.parser.isContDCharacter(line)) {
            const _character = character.toUpperCase();
            _character in this.charactersDialogsPenalties
              ? this.charactersDialogsPenalties[_character]++
              : (this.charactersDialogsPenalties[_character] = 1);
          }
          this.currentSpeaker = character;
          character in charactersDialogs
            ? charactersDialogs[character]++
            : (charactersDialogs[character] = 1);
        } else if (this.parser.isDialog(line)) {
          if (!this.metadata.dialogPage) {
            this.metadata.dialogPage = this.readPage + 1; // the readPage is always inferior to the current iteration, so +1
          }
          if (!isFirstLineParsed) {
            this.countScenes(scenes, scenesIntExt, scenesPeriod, true);
            isFirstLineParsed = true;
          }
          this.countDialogWords(line);
          dialogLength += line.str.length;
        } else if (this.parser.isNewActTag(line)) {
          isFirstLineParsed = true;
          this.currentScene = null;
        } else {
          if (!isFirstLineParsed) {
            this.countScenes(scenes, scenesIntExt, scenesPeriod, true);
            isFirstLineParsed = true;
          }
          if (this.firstPageAction.length < 201) {
            this.firstPageAction += " " + line.str;
          }
          this.countActionWords(line);
          actionLength += line.str.length;
        }
      }
      this.readPage++; // readPage = the number of the pdf page being read
      this.currentPage++; // currentPage = the number of the real script page being read (don't include title, blank and unscripted pages)
      const act = this.parser.getAct(pageLines);
      this.pages.push({
        charactersDialogs,
        charactersActions: {},
        charactersPresence: charactersDialogs, // for the moment, the characters presence only checks dialog counts. Actions will be added later, in parseEnrichedPage()
        scenes,
        scenesIntExt,
        scenesPeriod,
        isNewAct: !!act,
        // add new act name, or use previous page act name
        act: act
          ? act
          : this.pages.length > 0
          ? this.pages[this.pages.length - 1].act
          : "",
        dialogVSAction: {
          dialog: this.getPercentage(dialogLength, actionLength),
          action: this.getPercentage(actionLength, dialogLength),
        },
        page: this.currentPage,
      });
    } catch (err) {
      throw new Error(err as string);
    }
  }

  private getUniqueMentions(
    mention:
      | "act"
      | "charactersDialogs"
      | "charactersActions"
      | "charactersPresence"
      | "scenes"
      | "scenesPeriod"
  ) {
    if (mention === "act") {
      return [...new Set(this.pages.map((page) => page[mention]))];
    }
    return [
      ...new Set(this.pages.flatMap((page) => Object.keys(page[mention]))),
    ];
  }

  private formatScreenplay(pdfTitle: string): ParsedScreenplay {
    return {
      metadata: Object.assign(this.metadata, {
        title: this.metadata.title || pdfTitle,
        pages: this.pages.length,
      }),
      pages: this.pages,
      dialogVibe: this.parser.getPopularWords(this.dialogWords),
      actionVibe: this.parser.getPopularWords(this.actionWords),
      firstScene: this.firstScene,
      penalties: this.penalties,
      scenesPenalties: this.scenesPenalties,
      charactersDialogsPenalties: this.charactersDialogsPenalties,
      characterScenes: {},
      labels: {
        pages: this.pages.map((page) => page.page),
        charactersDialogs: this.getUniqueMentions("charactersDialogs"),
        charactersActions: this.getUniqueMentions("charactersActions"),
        charactersPresence: this.getUniqueMentions("charactersPresence"),
        scenes: this.getUniqueMentions("scenes"),
        scenesPeriod: this.getUniqueMentions("scenesPeriod"),
        acts: this.getUniqueMentions("act"),
        scenesIntExt: ["INT", "EXT"],
        dialogVSAction: ["dialog", "action"],
      },
      actionQuote: this.firstPageAction.replace(/\s+/g, " ").trim(), // remove extra empty spaces inside the sentence
      dialogQuote: {
        author: "",
        quote: "",
      },
      heroQuote: {
        author: "",
        quote: "",
      },
    };
  }

  public async parseScreenplay(
    pdfPath: Uint8Array,
    pdfTitle = "Unknown title"
  ): Promise<ParsedScreenplay> {
    try {
      const master = new MasterScreenplay(pdfPath, this.settings);
      await master.readScreenplay((pageLines: PDFLine[]) =>
        this.parsePage(pageLines)
      );
      const parsedScreenplay = this.formatScreenplay(pdfTitle);
      return await master.enrichScreenplay(parsedScreenplay);
    } catch (err) {
      return err;
    }
  }
}

class MasterScreenplay implements IMasterScreenplay {
  currentSpeaker: string;
  pdfPath: Uint8Array;
  characters: string[];
  parser: GenericParser;
  hero: string;
  isDialogQuoteComplete: boolean;
  isPrevLineDialog: boolean;
  heroQuote: string;
  pages: ParsedScreenplay["pages"];
  currentPage: number;
  dialogQuoteAuthor: string;
  dialogQuote: string;
  isHeroQuoteComplete: boolean;
  scenesPresence: { scene: string; characters: string[] }[];
  sceneIndex: number;
  settings: Settings;
  constructor(pdfPath: Uint8Array, settings: Settings) {
    this.parser = new GenericParser(settings);
    this.settings = settings;
    this.pdfPath = pdfPath;
    this.pages = [];
    this.hero = "";
    this.dialogQuoteAuthor = "";
    this.characters = [];
    this.currentSpeaker = "";
    this.dialogQuote = "";
    this.isDialogQuoteComplete = false;
    this.isHeroQuoteComplete = false;
    this.isPrevLineDialog = false;
    this.heroQuote = "";
    this.currentPage = 0;
    this.scenesPresence = [];
    this.sceneIndex = -1; // start at -1 because each time we enter a new scene, we increment the counter. So we will start at 0 for the first scene.
  }

  public async readScreenplay(
    pageParser: (data: PDFLine[]) => any
  ): Promise<void> {
    try {
      PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const doc = await PDFJS.getDocument(this.pdfPath).promise;
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const data = await page.getTextContent({
          disableCombineTextItems: this.settings.forceLineBreak,
        });
        pageParser(data.items as PDFLine[]);
      }
    } catch (err) {
      return err;
    }
  }

  private getHeroQuote(line: PDFLine) {
    // if a dialog snippet is available, there is no need to fetch a new snippet.
    if (this.isHeroQuoteComplete) {
      null;
    } else {
      // if we are inside a dialog, add the line to the snippet
      if (this.isPrevLineDialog) {
        this.heroQuote += " " + line.str;
      } else {
        // if we are in a new dialog (!isPreviousLineDialog)
        if (!this.isPrevLineDialog) {
          // replace the old snippet if it is too short, else mark it as completed
          if (this.heroQuote.length < 80) {
            this.heroQuote = line.str;
          } else {
            this.isHeroQuoteComplete = true;
          }
        }
      }
    }
  }

  private getCharacterPagePresence(charactersActions: Record<string, number>) {
    const charactersPresence =
      { ...this.pages[this.currentPage]["charactersPresence"] } || {};
    Object.entries(charactersActions).forEach(([character, action]) => {
      if (character in charactersPresence) {
        charactersPresence[character] += action;
      } else {
        charactersPresence[character] = action;
      }
    });
    return charactersPresence;
  }

  private parseEnrichedPage(pageLines: PDFLine[]) {
    const charactersActions: Record<string, number> = {};
    if (this.parser.isTitlePage(pageLines)) {
      return;
    }
    for (let i = 0; i < pageLines.length; i++) {
      const line = pageLines[i];
      if (this.parser.isCharacter(line)) {
        this.isPrevLineDialog = false;
        this.currentSpeaker = this.parser
          .getCharacterWithoutParenthesis(line.str)
          .toUpperCase();
        // edgecase: in some scripts, a character may appear before a scene is created
        if (this.sceneIndex > -1) {
          this.scenesPresence[this.sceneIndex].characters.push(
            this.currentSpeaker
          );
        }
      } else if (this.parser.isDialog(line)) {
        this.isPrevLineDialog = true;
      } else if (this.parser.isSceneSlug(line)) {
        this.isPrevLineDialog = false;
        this.sceneIndex++;
        const validSlug = this.parser.getValidSlug(pageLines, i);
        this.scenesPresence.push({ scene: validSlug, characters: [] });
      } else if (this.parser.isActionLine(line)) {
        this.isPrevLineDialog = false;
        const actionLine = line.str.toUpperCase();
        this.characters.forEach((character) => {
          if (actionLine.includes(character)) {
            character in charactersActions
              ? charactersActions[character]++
              : (charactersActions[character] = 1);
            if (this.sceneIndex > -1) {
              this.scenesPresence[this.sceneIndex].characters.push(character);
            }
          }
        });
      }
    }
    //end of loop
    const charactersPresence = this.getCharacterPagePresence(charactersActions);
    const newPage: ParsedPage = {
      ...this.pages[this.currentPage],
      charactersActions,
      charactersPresence,
    };
    this.currentPage++;
    this.pages = this.pages.map((page) =>
      page.page === this.currentPage ? newPage : page
    );
  }

  private getHero(): string {
    const totals: Record<string, number> = {};
    this.pages.forEach((page) => {
      return Object.entries(page.charactersPresence).forEach(
        ([character, value]) =>
          character in totals
            ? (totals[character] += value)
            : (totals[character] = value)
      );
    });
    const sortedCharacters = Object.entries(totals).sort(
      ([, a], [, b]) => b - a
    );
    return sortedCharacters.length > 0 ? sortedCharacters[0][0] : "";
  }

  private getAllCharactersLabels() {
    return [
      ...new Set(
        this.pages.flatMap((page) => Object.keys(page.charactersPresence))
      ),
    ];
  }

  private getDialogQuote(line: PDFLine) {
    // if a long enough dialog snippet is available, there is no need to fetch a new snippet.
    if (this.isDialogQuoteComplete) {
      null;
    } else {
      // if we are inside a dialog, add the line to the snippet
      if (this.isPrevLineDialog) {
        this.dialogQuote += " " + line.str;
      } else {
        // if we are in a new dialog (!isPreviousLineDialog)
        if (!this.isPrevLineDialog) {
          // replace the old snippet if it is too short, else mark it as completed
          if (this.dialogQuote.length < 80) {
            this.dialogQuoteAuthor = this.currentSpeaker;
            this.dialogQuote = line.str;
          } else {
            this.isDialogQuoteComplete = true;
          }
        }
      }
    }
  }

  private getDialogs(pageLines: PDFLine[]) {
    if (this.isDialogQuoteComplete && this.isHeroQuoteComplete) {
      return;
    }
    if (this.parser.isTitlePage(pageLines)) {
      return;
    }
    // if we have not seen any character yet, we might be reading a note page
    if (!this.currentSpeaker) {
      if (this.parser.isUnscriptedPage(pageLines)) {
        return;
      }
    }
    for (let i = 0; i < pageLines.length; i++) {
      const line = pageLines[i];
      if (this.parser.isCharacter(line)) {
        this.currentSpeaker = this.parser
          .getCharacterWithoutParenthesis(line.str)
          .toUpperCase();
        this.isPrevLineDialog = false;
      } else if (this.parser.isDialog(line)) {
        if (
          this.currentSpeaker &&
          this.currentSpeaker === this.hero.toUpperCase()
        ) {
          this.getHeroQuote(line);
        } else {
          this.getDialogQuote(line);
        }
        this.isPrevLineDialog = true;
      } else {
        this.isPrevLineDialog = false;
      }
    }
  }

  private getCharacterScenes() {
    const characterScenes: Record<string, number> = {};
    this.scenesPresence.forEach((scene) => {
      const uniqueCharacters = [...new Set(scene.characters)];
      uniqueCharacters.forEach((character) => {
        character in characterScenes
          ? characterScenes[character]++
          : (characterScenes[character] = 1);
      });
    });
    return characterScenes;
  }

  public async enrichScreenplay(
    screenplay: ParsedScreenplay
  ): Promise<ParsedScreenplay> {
    try {
      this.characters = screenplay.labels.charactersPresence.map((character) =>
        character.toUpperCase()
      );
      this.pages = screenplay.pages;
      await this.readScreenplay((pageLines: PDFLine[]) =>
        this.parseEnrichedPage(pageLines)
      );
      this.hero = this.getHero();
      this.currentSpeaker = ""; // reset current speaker before checking the dialogs
      await this.readScreenplay((pageLines: PDFLine[]) =>
        this.getDialogs(pageLines)
      );
      return {
        ...screenplay,
        pages: this.pages,
        characterScenes: this.getCharacterScenes(),
        heroQuote: {
          author: this.hero.toUpperCase(),
          quote: this.heroQuote,
        },
        dialogQuote: {
          author: this.dialogQuoteAuthor,
          quote: this.dialogQuote,
        },
        labels: {
          ...screenplay.labels,
          charactersPresence: this.getAllCharactersLabels(),
        },
      };
    } catch (err) {
      return err;
    }
  }
}
