import React from "react";
import { ParsedCharacter } from "models/screenplay";
import styles from "./hero-apperance.module.css";
import Quote from "components/quote";

interface IProps {
  pages: ParsedCharacter["pages"];
  name: string;
  quote: ParsedCharacter["dialogQuote"];
}

export default function FirstCharacterApperance({
  pages,
  quote,
  name,
}: IProps) {
  const firstDialogPage = pages.find((page) => !!page.dialogs[name])?.page;
  return (
    <div className={styles.root}>
      <div className={styles.quotePush} />
      <Quote quote={quote} type="end" />
      {firstDialogPage && (
        <span>
          First words from <span className={styles.hero}>{name}</span>, page{" "}
          {firstDialogPage}
        </span>
      )}
    </div>
  );
}
