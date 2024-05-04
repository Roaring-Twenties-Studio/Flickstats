import { useCallback, useState } from "react";
import {
  ParsedCharacter,
  ParsedScreenplay,
  Settings,
  MetaData,
} from "models/screenplay";
import { ScreenplayParser } from "./screenplay-parser";
import { CharacterParser } from "./character-parser";
import { DEFAULT_SETTINGS } from "./settings";
import * as PDFJS from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

const DEFAULT_ERROR_MSG = "Your screenplay couldn't be parsed";

const getScreenplayBuffer = (screenplay: File): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const data = new Uint8Array(
        new Uint8Array(e.target.result as ArrayBuffer)
      );
      if (data) {
        resolve(data);
      }
      reject();
    };
    fileReader.onerror = () => reject();
    fileReader.readAsArrayBuffer(screenplay);
  });

export default function useParseScreenplay() {
  const [buffer, setBuffer] = useState<Uint8Array>(null);
  const [title, setTitle] = useState("Unknown title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [parsedScreenplay, setParsedScreenplay] = useState(null);
  const [parsedCharacter, setParsedCharacter] = useState(null);
  const [preview, setPreview] = useState<
    Record<"titlePage" | "dialogPage", PDFPageProxy>
  >({
    titlePage: null,
    dialogPage: null,
  });

  const fetchPreviews = useCallback(
    async (metadata: MetaData, buffer: Uint8Array): Promise<void> => {
      try {
        const doc: PDFDocumentProxy = await PDFJS.getDocument(buffer).promise;
        const titlePage = await doc.getPage(metadata.titlePage);
        const dialogPage = await doc.getPage(metadata.dialogPage);
        setPreview({ titlePage, dialogPage });
      } catch (err) {
        new Error();
      }
    },
    []
  );

  const onParseScreenplay = useCallback(
    async (screenplay: File): Promise<void> => {
      try {
        setLoading(true);
        const parser = new ScreenplayParser(DEFAULT_SETTINGS);
        const buffer = await getScreenplayBuffer(screenplay);
        setBuffer(buffer);
        const pdfTitle = screenplay.name
          .replace(".pdf", "")
          .replace(/[^a-zA-Z0-9: ']/g, " ");
        setTitle(pdfTitle);
        const result: ParsedScreenplay = await parser.parseScreenplay(
          buffer,
          pdfTitle
        );
        if (result) {
          await fetchPreviews(result.metadata, buffer);
          setParsedScreenplay(result);
        } else {
          setError(DEFAULT_ERROR_MSG);
        }
        setLoading(false);
      } catch (err) {
        setError(DEFAULT_ERROR_MSG);
      }
    },
    [fetchPreviews]
  );

  const onReset = useCallback(() => {
    setBuffer(null);
    setParsedScreenplay(null);
    setParsedCharacter(null);
    setPreview({ titlePage: null, dialogPage: null });
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const onResetCharacter = useCallback(() => {
    setParsedCharacter(null);
  }, []);

  const onChangeSettings = useCallback(
    async (newSettings: Settings): Promise<void> => {
      try {
        setSettings(newSettings);
        const parser = new ScreenplayParser(newSettings);
        const result: ParsedScreenplay = await parser.parseScreenplay(
          buffer,
          title
        );
        if (result) {
          await fetchPreviews(result.metadata, buffer);
          setParsedScreenplay(result);
        } else {
          setError(DEFAULT_ERROR_MSG);
        }
      } catch (err) {
        setError(DEFAULT_ERROR_MSG);
      }
    },
    [buffer, fetchPreviews, title]
  );

  const onParseCharacter = async (character: string): Promise<void> => {
    try {
      const parser = new CharacterParser(settings, character);
      const result: ParsedCharacter = await parser.parseCharacter(buffer);
      if (result) {
        setParsedCharacter(result);
      } else {
        setError(`${character} couldn't be parsed`);
      }
    } catch (_) {
      setError(`${character} couldn't be parsed`);
    }
  };
  return {
    parsedScreenplay,
    parsedCharacter,
    loading,
    error,
    settings,
    onParseScreenplay,
    onResetCharacter,
    onParseCharacter,
    onChangeSettings,
    onReset,
    preview,
  };
}
