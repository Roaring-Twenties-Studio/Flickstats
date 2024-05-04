import React, { useMemo } from "react";
import Counter from "components/counter";
import HeroApperance from "components/hero-appearance";
import Row from "components/row";
import RowTitle from "components/row-title";
import Title, { Text } from "components/title";
import MultipleLineChartCard from "containers/charts/multiple-line-chart";
import VerticalBarChartCard from "containers/charts/vertical-bar-chart";
import { ParsedScreenplay } from "models/screenplay";
import CharacterScenes from "./character-scenes";
import styles from "./style.module.css";

interface IProps {
  parsedScreenplay: ParsedScreenplay;
}

const Characters = ({ parsedScreenplay }: IProps) => {
  const {
    pages,
    heroQuote,
    labels,
    characterScenes,
    charactersDialogsPenalties,
  } = parsedScreenplay;
  const charactersLabels = useMemo(() => {
    const totals: Record<string, number> = {};
    pages.forEach((page) => {
      Object.entries(page.charactersPresence).forEach(([key, value]) =>
        key in totals ? (totals[key] += value) : (totals[key] = value)
      );
    });
    const sortedCharacters = Object.entries(totals).sort(
      ([, a], [, b]) => b - a
    );
    return sortedCharacters.map((character) => character[0]);
  }, [pages]);

  const mainLabels = [...charactersLabels].splice(0, 5); // top 5
  const secondaryLabels = [...charactersLabels].splice(5, 10); // 10 next characters
  const minorLabels = [...charactersLabels].splice(15); // other minors characters, if any
  const mainCharacterLabels = useMemo(
    () => ({
      ...labels,
      charactersActions: mainLabels,
      charactersDialogs: mainLabels,
      charactersPresence: mainLabels,
    }),
    [labels, mainLabels]
  );
  const secondaryCharacterLabels = useMemo(
    () => ({
      ...labels,
      charactersActions: secondaryLabels,
      charactersDialogs: secondaryLabels,
      charactersPresence: secondaryLabels,
    }),
    [labels, secondaryLabels]
  );
  const minorCharacterLabels = useMemo(
    () => ({
      ...labels,
      charactersActions: minorLabels,
      charactersDialogs: minorLabels,
      charactersPresence: minorLabels,
    }),
    [labels, minorLabels]
  );

  const mainPalette = useMemo(() => {
    const colors = ["#f0f078", "#ff9800", "#e56fed", "#d92534", "#fff"];
    return mainLabels.reduce(
      (characters, character, i) => ({ ...characters, [character]: colors[i] }),
      {}
    );
  }, [mainLabels]);

  return (
    <div className={styles.root}>
      <RowTitle title="Characters" />
      <div className={styles.counterCasting}>
        <Counter
          count={charactersLabels.length}
          legend="people to cast"
          icon="clapperboard"
        />
      </div>
      <Row>
        <CharacterScenes scenes={characterScenes} />
      </Row>
      <Row>
        <VerticalBarChartCard
          pages={pages}
          category="charactersDialogs"
          label="dialogs"
          penalties={charactersDialogsPenalties}
        />
      </Row>
      <Row>
        <VerticalBarChartCard
          pages={pages}
          category="charactersActions"
          label="actions"
        />
      </Row>
      <HeroApperance heroQuote={heroQuote} />
      <RowTitle title="Distribution over time" />
      <div className={styles.push} />
      {mainLabels.length > 0 ? (
        <>
          <Title
            title={`Top ${mainLabels.length} character${
              mainLabels.length > 1 ? "s" : ""
            }`}
          />
          <div className={styles.row}>
            <MultipleLineChartCard
              pages={pages}
              labels={mainCharacterLabels}
              xAxis="pages"
              yAxis="charactersPresence"
              colorsPalette={mainPalette}
            />
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <Text text="No main characters detected" />
        </div>
      )}
      <div className={styles.bigPush}>
        {secondaryLabels.length > 0 ? (
          <>
            <Title
              title={`${secondaryLabels.length} secondary character${
                secondaryLabels.length > 1 ? "s" : ""
              }`}
            />
            <div className={styles.row}>
              <MultipleLineChartCard
                pages={pages}
                labels={secondaryCharacterLabels}
                xAxis="pages"
                yAxis="charactersPresence"
              />
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <Text text="No secondary characters detected" />
          </div>
        )}
      </div>
      <div className={styles.bigPush}>
        {minorLabels.length > 0 ? (
          <>
            <Title
              title={`${minorLabels.length} other character${
                minorLabels.length > 1 ? "s" : ""
              }`}
            />
            <div className={styles.row}>
              <MultipleLineChartCard
                pages={pages}
                labels={minorCharacterLabels}
                xAxis="pages"
                yAxis="charactersPresence"
              />
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <Text text="No minors characters detected" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;
