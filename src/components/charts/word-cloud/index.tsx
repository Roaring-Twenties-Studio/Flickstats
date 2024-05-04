import React, { useMemo } from "react";
import type { ParsedScreenplay, PopularWord } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  words: PopularWord[];
  wordType: "dialog" | "action";
}

function removeParenthesis(word: string): string {
  let res = word;
  if (word.startsWith("(")) {
    res = word.substring(1);
  }
  if (word.endsWith(")")) {
    res = res.substring(0, res.length - 1);
  }
  return res;
}

// if the word is a number, only return number above 99. Dates and codes are relevant, not ages.
function isValidWord(word: PopularWord): boolean {
  // @ts-ignore: isNaN actually works with strings. "55" is a number, "hello" is not
  if (!isNaN(word.text)) {
    return Number(word.text) > 99;
  }
  return true;
}

function formatWords(words: ParsedScreenplay["dialogVibe"]) {
  const validWords = words.filter((word) => isValidWord(word));

  const wordValues: number[] = validWords
    .reduce((acc, cur) => {
      if (acc.includes(cur.value)) return acc;
      return [...acc, cur.value];
    }, [])
    .sort((a, b) => (a > b ? 1 : -1));
  const total = validWords.reduce((acc, { value }) => (acc += value), 0);
  const averageValue = total / validWords.length;
  // we need 10 groups of value to adjust the font-size: 1,2,3...10.
  // each value correspond to a predefined font-size (value: 4: 12px, value:7: 24px)
  // once we have the average value, we divide it by 5
  // stepValue * 5 = averageValue, stepValue *10 = maxValue for font-size (10)
  // if we have less than 10 values, no need for calculation, we already have our N chunks.
  // We just need to fill the missing chunks with 0, so the biggest word has the max weight.
  const chunkTreshold = Math.round(averageValue / 5);
  const chunks =
    wordValues.length <= 10
      ? [...Array(10 - wordValues.length)].fill(0).concat(wordValues)
      : [...Array(10)].map((_, i) => (i + 1) * chunkTreshold);
  const data = validWords.map(({ value, text }) => {
    let weight: number;
    if (value <= chunks[0]) {
      weight = 1;
    } else if (value <= chunks[1]) {
      weight = 2;
    } else if (value <= chunks[2]) {
      weight = 3;
    } else if (value <= chunks[3]) {
      weight = 4;
    } else if (value <= chunks[4]) {
      weight = 5;
    } else if (value <= chunks[5]) {
      weight = 6;
    } else if (value <= chunks[6]) {
      weight = 7;
    } else if (value <= chunks[7]) {
      weight = 8;
    } else if (value <= chunks[8]) {
      weight = 9;
    } else {
      weight = 10;
    }
    return { text: removeParenthesis(text), value, weight };
  });
  return data.sort(() => Math.random() - 0.5); // shuffle words
}

export default function WordCloud({ words, wordType }: IProps) {
  const formatedWords = useMemo(() => formatWords(words), [words]);

  return formatedWords.length > 0 ? (
    <ul className={styles.cloud} aria-label="word cloud">
      {formatedWords.map((word, i) => (
        <li key={i} className={styles.wordWrapper}>
          <div className={styles.tooltip}>
            {word.text} ({word.value})
          </div>
          <div className={styles[wordType]} data-weight={word.weight} key={i}>
            {word.text}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className={styles.noData}>No data detected</p>
  );
}
