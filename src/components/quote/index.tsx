import React from "react";
import QuoteLeft from "components/icons/quote-left.svg";
import QuoteRight from "components/icons/quote-right.svg";
import styles from "./quote.module.css";

interface IProps {
  quote: string;
  author?: string;
  type: "intro" | "end";
}

const getQuote = (quote: string, type: IProps["type"]) => {
  if (quote.endsWith("...") || type === "end") {
    return quote;
  }
  if (quote.endsWith("..")) {
    return quote + ".";
  }
  if (quote.endsWith(".")) {
    return quote + "..";
  }
  return quote + "...";
};

export default function Quote({ quote, author, type }: IProps) {
  return (
    <div>
      <div className={styles.root}>
        <div
          className={`${styles.container} ${type === "end" && styles.centered}`}
        >
          <span className={styles.quotemarkLeft}>
            <QuoteLeft width={32} height={32} />
          </span>
          <span>{getQuote(quote, type)}</span>
          <span className={styles.quotemarkRight}>
            <QuoteRight width={32} height={32} />
          </span>
        </div>
      </div>
      {author && <p className={styles.quoteAuthor}>- {author} -</p>}
    </div>
  );
}
