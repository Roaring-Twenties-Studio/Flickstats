export type ParsedPage = {
  charactersDialogs: { [name: string]: number };
  charactersActions: { [name: string]: number };
  charactersPresence: { [name: string]: number };
  scenes: { [place: string]: number };
  scenesIntExt: { [place: string]: number }; // INT or EXT
  scenesPeriod: { [period: string]: number };
  dialogVSAction: { [key: string]: number }; // dialog or action
  isNewAct: boolean;
  act: string;
  page: number;
};

export type MetaData = {
  writtenBy: string;
  title: string;
  email: string;
  phone: string;
  pages: number;
  titlePage: number;
  dialogPage: number;
};

export type PDFLine = {
  str: string;
  dir: string;
  // transform is a matrix that defines the position of the line on the pdf.
  // The 5th value is the X position (0===left more=> to the right).
  // The 6th value is the Y position.
  // Based on X (5th value), we can know whether it's a character line or a slug/action.
  transform: [number, number, number, number, number, number]; // [_, _, _, _, _, x, y]
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
};

export type PopularWord = {
  text: string;
  value: number;
};

export type ParsedScreenplay = {
  metadata: {
    writtenBy: string;
    title: string;
    email: string;
    phone: string;
    pages: number;
    titlePage: number;
    dialogPage: number;
  };
  penalties: Record<string, number>;
  scenesPenalties: Record<string, number>;
  charactersDialogsPenalties: Record<string, number>;
  firstScene: string;
  characterScenes: Record<string, number>;
  pages: ParsedPage[];
  actionVibe: PopularWord[];
  dialogVibe: PopularWord[];
  labels: {
    pages: number[];
    charactersDialogs: string[];
    charactersActions: string[];
    charactersPresence: string[];
    scenes: string[];
    scenesIntExt: string[];
    scenesPeriod: string[];
    dialogVSAction: string[];
    acts: string[];
  };
  actionQuote: string;
  dialogQuote: {
    author: string;
    quote: string;
  };
  heroQuote: {
    author: string;
    quote: string;
  };
};

export type Settings = {
  X_CENTER_STARTING_POSITION: number;
  X_RIGHT_STARTING_POSITION: number;
  Y_CENTER_STARTING_POSITION: number;
  forceLineBreak: boolean;
  excludedCharacters: string[];
};

export type ParsedCharacter = {
  name: string;
  firstScene: string;
  dialogVibe: {
    text: string;
    value: number;
  }[];
  dialogQuote: string;
  firstDialogQuote: string;
  penalties: Record<string, number>;
  scenesPenalties: Record<string, number>;
  characterDialogsPenalties: Record<string, number>;
  pages: {
    page: number;
    scenes: { [place: string]: number };
    scenesIntExt: { [place: string]: number }; // INT or EXT
    scenesPeriod: { [period: string]: number };
    dialogs: Record<string, number>;
    presence: Record<string, number>;
    actions: Record<string, number>;
  }[];
  labels: {
    pages: number[];
    characters: string[];
    dialogs: string[];
    dialogLines: string[];
    presence: string[];
    scenes: string[];
    actions: string[];
    scenesIntExt: string[];
    scenesPeriod: string[];
  };
};

export interface IGenericParser {
  isActionLine(pageLine: PDFLine): boolean;
  isCharacter(pageLine: PDFLine): boolean;
  isContDCharacter(pageLine: PDFLine): boolean;
  isDialog(pageLine: PDFLine): boolean;
  isNewActTag(pageLine: PDFLine): boolean;
  isPageNumber(pageLine: PDFLine): boolean;
  isSceneSlug(pageLine: PDFLine): boolean;
  isTitlePage(pageLines: PDFLine[]): boolean;
  getAct(pageLines: PDFLine[]): string;
  getCharacterWithoutParenthesis(lineStr: string): string;
  getPopularWords(wordsList: Record<string, number>): PopularWord[];
  getValidSlug(pageLines: PDFLine[], index: number): string;
}

export interface IScreenplayParser {
  parseScreenplay(pdfPath: Uint8Array): Promise<ParsedScreenplay>;
}

export interface ICharacterParser {
  parseCharacter(
    pdfPath: Uint8Array,
    character: string
  ): Promise<ParsedCharacter>;
}

export interface IMasterScreenplay {
  enrichScreenplay(screenplay: ParsedScreenplay): Promise<ParsedScreenplay>;
  readScreenplay(pageParser: (data: PDFLine[]) => any): Promise<void>;
}
