import React, { useState } from "react";
import styles from "./characters-modal.module.css";
import Ban from "components/icons/ban.svg";
import Checkmark from "components/icons/checkmark.svg";

interface IProps {
  onChangeExclusionList: (characters: string[]) => void;
  excludedCharacters: string[];
  characters: string[];
}

export default function CharactersExclusion({
  excludedCharacters,
  characters,
  onChangeExclusionList,
}: IProps) {
  const [validCharacters, setValidCharacters] = useState(characters);

  const onExclude = (character: string) => {
    const newIncludeList = validCharacters.filter(
      (validCharacter) => validCharacter !== character
    );
    setValidCharacters([...new Set(newIncludeList)]);
    return onChangeExclusionList([...excludedCharacters, character]);
  };

  const onInclude = (character: string) => {
    const newExcludeList = excludedCharacters.filter(
      (excludedCharacter) => excludedCharacter !== character
    );
    setValidCharacters([...new Set([...validCharacters, character])]);
    return onChangeExclusionList(newExcludeList);
  };

  return (
    <div className={styles.excludeRoot}>
      <p className={styles.legend}>
        If FlickStats has mistaken a line for a character, you can exclude it
        from the character list.
      </p>
      <div className={styles.invalidListTitle}>
        <Ban width={14} height={14} />
        INVALID CHARACTERS
      </div>
      <ul>
        {excludedCharacters.length > 0 ? (
          excludedCharacters.sort().map((excludedCharacter, i) => (
            <li
              className={styles.invalidCharacter}
              key={`excluded_${i}`}
              onClick={() => onInclude(excludedCharacter)}
            >
              {excludedCharacter}
            </li>
          ))
        ) : (
          <li className={styles.noCharacters}>NO INVALID CHARACTERS.</li>
        )}
      </ul>
      <br />
      <div className={styles.validListTitle}>
        <Checkmark width={14} height={14} /> VALID CHARACTERS
      </div>
      <ul>
        {validCharacters.length > 0 ? (
          validCharacters.sort().map((character, i) => (
            <li
              key={`${character}_${i}`}
              className={styles.validCharacter}
              onClick={() => onExclude(character)}
            >
              {character}
            </li>
          ))
        ) : (
          <li className={styles.noCharacters}>NO VALID CHARACTERS.</li>
        )}
      </ul>
    </div>
  );
}
