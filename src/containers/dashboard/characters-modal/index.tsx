import Modal from "components/modal";
import React, { useMemo, useRef, useState } from "react";
import UserGear from "components/icons/user-gear.svg";
import styles from "./characters-modal.module.css";
import { Settings } from "models/screenplay";
import Tabs from "./tabs";
import Focus from "./focus";
import Exclude from "./exclude";

interface IProps {
  onClose: () => void;
  open: boolean;
  onChangeCharacter: (character: string) => Promise<void>;
  characters: string[];
  settings: Settings;
  onChangeSettings: (settings: Settings) => Promise<void>;
}

type Tab = "focus" | "exclude";

function Title() {
  return (
    <div className={styles.title}>
      <UserGear width={24} height={24} />
      <span>Characters</span>
    </div>
  );
}

export function areListEqual(prev: string[], next: string[]): boolean {
  if (prev.length !== next.length) {
    return false;
  }
  return prev.every((v) => next.some((nextV) => nextV === v));
}

export default function CharactersModal({
  open,
  characters,
  settings,
  onClose,
  onChangeCharacter,
  onChangeSettings,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [characterFocus, setCharacterFocus] = useState("");
  const [excludedCharacters, setExcludedCharacters] = useState(
    settings.excludedCharacters
  );
  const [tab, setTab] = useState<Tab>("focus");
  const ref = useRef<HTMLDivElement>();

  const onChangeTab = (newTab: Tab) => {
    setTab(newTab);
    if (ref && ref.current) {
      ref.current.scrollTop = 0;
    }
  };

  const onValidate = async () => {
    setLoading(true);
    if (tab === "focus") {
      await onChangeCharacter(characterFocus);
    } else {
      await onChangeSettings({ ...settings, excludedCharacters });
    }
    setCharacterFocus("");
    setLoading(false);
    setTab("focus");
    window.scrollTo(0, 0);
    onClose();
  };

  const onCancel = () => {
    setCharacterFocus("");
    setExcludedCharacters(settings.excludedCharacters);
    setTab("focus");
    onClose();
  };

  const canValidate = useMemo(() => {
    if (tab === "focus") {
      return !!characterFocus;
    }
    return !areListEqual(settings.excludedCharacters, excludedCharacters);
  }, [characterFocus, excludedCharacters, settings.excludedCharacters, tab]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      content={
        <div>
          <Tabs
            activeTab={tab}
            onChangeTab={onChangeTab}
            excludedCharactersTotal={excludedCharacters.length}
          />
          <div className={styles.content} ref={ref}>
            {tab === "focus" ? (
              <Focus
                characterFocus={characterFocus}
                characters={characters}
                onSelectCharacter={setCharacterFocus}
              />
            ) : (
              <Exclude
                onChangeExclusionList={setExcludedCharacters}
                characters={characters}
                excludedCharacters={excludedCharacters}
              />
            )}
          </div>
        </div>
      }
      title={<Title />}
      onValidate={canValidate ? onValidate : null}
      isLoading={loading}
    />
  );
}
