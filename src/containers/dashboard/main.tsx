import React, { useState } from "react";
import { PDFPageProxy } from "pdfjs-dist";
import Row from "components/row";
import ScriptTitle from "components/script-title";
import type {
  ParsedCharacter,
  ParsedScreenplay,
  Settings,
} from "models/screenplay";
import Character from "./character";
import CharactersModal from "./characters-modal";
import Overview from "./overview";
import SettingsModal from "./settings-modal";
import styles from "./style.module.css";

interface IProps {
  parsedScreenplay: ParsedScreenplay;
  settings: Settings;
  parsedCharacter: ParsedCharacter;
  preview: Record<"titlePage" | "dialogPage", PDFPageProxy>;
  onParseCharacter: (character: string) => Promise<void>;
  onClearPage: () => void;
  onLeaveCharacterPage: () => void;
  onChangeSettings: (settings: Settings) => Promise<void>;
}

const DashboardData = ({
  parsedScreenplay,
  parsedCharacter,
  onLeaveCharacterPage,
  onParseCharacter,
  preview,
  settings,
  onClearPage,
  onChangeSettings,
}: IProps) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openCharacters, setOpenCharacters] = useState(false);
  return (
    <>
      <SettingsModal
        onClose={() => setOpenSettings(false)}
        open={openSettings}
        settings={settings}
        onChangeSettings={onChangeSettings}
        titlePage={preview.titlePage}
        dialogPage={preview.dialogPage}
      />
      <CharactersModal
        onClose={() => setOpenCharacters(false)}
        open={openCharacters}
        characters={parsedScreenplay.labels.charactersPresence}
        onChangeCharacter={onParseCharacter}
        settings={settings}
        onChangeSettings={onChangeSettings}
      />
      <ScriptTitle
        title={
          parsedCharacter
            ? parsedCharacter.name
            : parsedScreenplay.metadata.title
        }
        onClearPage={onClearPage}
        onLeaveCharacterPage={!!parsedCharacter && onLeaveCharacterPage}
        onOpenSettings={() => setOpenSettings(true)}
        onOpenCharacters={() => setOpenCharacters(true)}
      />
      {parsedCharacter ? (
        <Character parsedCharacter={parsedCharacter} />
      ) : (
        <Overview parsedScreenplay={parsedScreenplay} />
      )}
      <Row>
        <p className={styles.copyright}>Report by FlickStats © </p>
      </Row>
    </>
  );
};

export default DashboardData;
