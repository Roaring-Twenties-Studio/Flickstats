import React from "react";
import Quote from "components/quote";
import type { ParsedCharacter } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  pages: ParsedCharacter["pages"];
  name: string;
  quote: ParsedCharacter["dialogQuote"];
}

export default function CharacterApperance({ pages, quote, name }: IProps) {
  const firstDialogPage = pages.find((page) => !!page.dialogs[name])?.page;
  return (
    <div className={styles.root}>
      <p className={styles.title}>{name}</p>
      {firstDialogPage && <span>starts talking on page {firstDialogPage}</span>}
      <div className={styles.quotePush} />
      <Quote quote={quote} type="end" />
    </div>
  );
}
