import React from "react";
import RowTitle from "components/row-title";
import { ParsedCharacter } from "models/screenplay";
import styles from "./dashboard-container.module.css";
import Row from "components/row";
import WordCloud from "components/word-cloud";
import MultipleLineChartCard from "containers/multiple-line-chart/character";
import IntExtText from "components/int-ext-text/character";
import PieChartCard from "containers/pie-chart/character";
import TitleLight from "components/title/light";
import PeriodText from "components/period-text/character";
import DoughnutChartCard from "containers/doughnut-chart/character";
import Counter from "components/counter";
import HorizontalBarChartCard from "containers/horizontal-bar-chart/character";
import FirstScene from "components/first-scene/character";
import StackedBarChartCard from "containers/stacked-bar-chart/character";
import FirstQuote from "components/hero-appearance/first-quote";
import Quote from "components/quote";
import DialogsCount from "components/dialogs-count/character";

interface IProps {
  parsedCharacter: ParsedCharacter;
}

const Character = ({ parsedCharacter }: IProps) => {
  const formatedName =
    parsedCharacter.name[0].toUpperCase() + parsedCharacter.name.substring(1);
  return (
    <div className={styles.characterRoot}>
      <div className={styles.push} />
      {parsedCharacter.firstDialogQuote && (
        <>
          <FirstQuote
            name={formatedName}
            quote={parsedCharacter.firstDialogQuote}
            pages={parsedCharacter.pages}
          />
        </>
      )}
      <FirstScene scene={parsedCharacter.firstScene} />
      <RowTitle title="Scenes" />
      <IntExtText
        pages={parsedCharacter.pages}
        name={formatedName}
        penalties={parsedCharacter.penalties}
      />
      <PieChartCard
        pages={parsedCharacter.pages}
        labels={parsedCharacter.labels}
        penalties={parsedCharacter.penalties}
        category="scenesIntExt"
        colorsPalette={{ EXT: "#5b5b0a", INT: "#f0f078" }}
      />
      <div className={styles.push} />
      <Row>
        <MultipleLineChartCard
          pages={parsedCharacter.pages}
          labels={parsedCharacter.labels}
          xAxis="pages"
          yAxis="scenesIntExt"
          filterEmptyValues={false}
          colorsPalette={{ EXT: "#5b5b0a", INT: "#f0f078" }}
          title={<TitleLight title="Evolution over time" />}
        />
      </Row>
      {parsedCharacter.labels.scenesPeriod.length > 0 && (
        <>
          <PeriodText
            pages={parsedCharacter.pages}
            periods={parsedCharacter.labels.scenesPeriod}
            penalties={parsedCharacter.penalties}
            name={formatedName}
          />
          <DoughnutChartCard
            pages={parsedCharacter.pages}
            labels={parsedCharacter.labels}
            penalties={parsedCharacter.penalties}
            category="scenesPeriod"
            title="Periods"
          />
        </>
      )}
      <div className={styles.counterLocation}>
        <Counter
          count={parsedCharacter.labels.scenes.length}
          legend={
            parsedCharacter.labels.scenes.length === 1
              ? "location to shoot"
              : "locations to shoot"
          }
          icon="camera"
        />
      </div>
      <Row>
        <HorizontalBarChartCard
          pages={parsedCharacter.pages}
          penalties={parsedCharacter.scenesPenalties}
          category="scenes"
        />
      </Row>
      <Row>
        <StackedBarChartCard
          pages={parsedCharacter.pages}
          labels={parsedCharacter.labels}
          category="scenes"
        />
      </Row>
      <div className={styles.push} />
      {parsedCharacter.dialogQuote && (
        <Row>
          <Quote
            quote={parsedCharacter.dialogQuote}
            author={parsedCharacter.name}
            type="end"
          />
        </Row>
      )}
      <div className={styles.push} />
      <DialogsCount
        pages={parsedCharacter.pages}
        name={parsedCharacter.name}
        penalties={parsedCharacter.characterDialogsPenalties}
      />
      <RowTitle title="Dialogue vibe" />
      <Row>
        <WordCloud words={parsedCharacter.dialogVibe} wordType="dialog" />
      </Row>
      <div className={styles.push} />
      <TitleLight title="Dialogs over time" />
      <MultipleLineChartCard
        pages={parsedCharacter.pages}
        labels={parsedCharacter.labels}
        xAxis="pages"
        yAxis="dialogs"
      />
      <div className={styles.bigPush} />
      <TitleLight title="Actions over time" />
      <MultipleLineChartCard
        pages={parsedCharacter.pages}
        labels={parsedCharacter.labels}
        xAxis="pages"
        yAxis="actions"
      />
      <div className={styles.bigPush} />
      <TitleLight title="Presence over time" />
      <MultipleLineChartCard
        pages={parsedCharacter.pages}
        labels={parsedCharacter.labels}
        xAxis="pages"
        yAxis="presence"
      />
      <div className={styles.push} />
    </div>
  );
};

export default Character;
