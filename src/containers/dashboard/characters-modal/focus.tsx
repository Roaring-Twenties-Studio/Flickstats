import React from "react";
import styles from "./characters-modal.module.css";

interface IProps {
  onSelectCharacter: (character: string) => void;
  characters: string[];
  characterFocus: string;
}

export default function CharactersFocus({
  characters,
  characterFocus,
  onSelectCharacter,
}: IProps) {
  return (
    <div>
      <p className={styles.legend}>Select the character you want to analyze</p>
      <div className={styles.checkboxes}>
        {characters.sort().map((character, i) => (
          <div key={`${character}_${i}`} className={styles.character}>
            <input
              type="checkbox"
              checked={characterFocus === character}
              value={character}
              name="char"
              id={character}
              onChange={() =>
                onSelectCharacter(character === characterFocus ? "" : character)
              }
            />
            <label className={styles.characterLabel} htmlFor={character}>
              {character}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
