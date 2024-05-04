import React, { useLayoutEffect } from "react";
import Counter from "components/counter";
import FirstScene from "components/first-scene";
import Infos from "components/infos";
import IntExtText from "components/int-ext-text";
import Percentages from "components/percentages";
import PeriodText from "components/period-text";
import Quote from "components/quote";
import Row from "components/row";
import RowTitle from "components/row-title";
import Title from "components/title";
import WordCloud from "components/charts/word-cloud";
import Characters from "containers/characters";
import DoughnutChartCard from "containers/charts/doughnut-chart";
import HorizontalBarChartCard from "containers/charts/horizontal-bar-chart";
import MultipleLineChartCard from "containers/charts/multiple-line-chart";
import PieChartCard from "containers/charts/pie-chart";
import StackedBarChartCard from "containers/charts/stacked-bar-chart";
import StructureChart from "containers/charts/structure-chart";
import { ParsedScreenplay } from "models/screenplay";
import styles from "./style.module.css";
import DialogsCount from "components/dialogs-count";

interface IProps {
  parsedScreenplay: ParsedScreenplay;
}

const Overview = ({ parsedScreenplay }: IProps) => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Infos
        metadata={parsedScreenplay.metadata}
        actionQuote={parsedScreenplay.actionQuote}
      />
      <RowTitle title="Dialog and Action" />
      <Percentages pages={parsedScreenplay.pages} />
      <Row>
        <MultipleLineChartCard
          pages={parsedScreenplay.pages}
          labels={parsedScreenplay.labels}
          xAxis="pages"
          yAxis="dialogVSAction"
          yCallback={(value: number) => `${value}%`}
          isPercentage
          colorsPalette={{ dialog: "#f0f078", action: "#78b4f0" }}
        />
      </Row>
      <div className={styles.push} />
      <DialogsCount
        pages={parsedScreenplay.pages}
        penalties={parsedScreenplay.charactersDialogsPenalties}
      />
      <div className={styles.push} />
      <RowTitle title="Dialogue vibe" />
      <Row>
        <WordCloud words={parsedScreenplay.dialogVibe} wordType="dialog" />
      </Row>
      <div className={styles.push} />
      <RowTitle title="Action vibe" />
      <Row>
        <WordCloud words={parsedScreenplay.actionVibe} wordType="action" />
      </Row>
      <div className={styles.push} />
      <div className={styles.push} />
      <RowTitle title="Scenes" />
      <IntExtText
        pages={parsedScreenplay.pages}
        penalties={parsedScreenplay.penalties}
      />
      <PieChartCard
        pages={parsedScreenplay.pages}
        labels={parsedScreenplay.labels}
        penalties={parsedScreenplay.penalties}
        category="scenesIntExt"
        colorsPalette={{ EXT: "#5b5b0a", INT: "#f0f078" }}
      />
      <div className={styles.push} />
      <Row>
        <MultipleLineChartCard
          pages={parsedScreenplay.pages}
          labels={parsedScreenplay.labels}
          xAxis="pages"
          yAxis="scenesIntExt"
          filterEmptyValues={false}
          colorsPalette={{ EXT: "#5b5b0a", INT: "#f0f078" }}
          title={<Title title="Evolution over time" />}
        />
      </Row>
      {parsedScreenplay.labels.scenesPeriod.length > 0 && (
        <>
          <PeriodText
            pages={parsedScreenplay.pages}
            periods={parsedScreenplay.labels.scenesPeriod}
            penalties={parsedScreenplay.penalties}
          />
          <DoughnutChartCard
            pages={parsedScreenplay.pages}
            labels={parsedScreenplay.labels}
            penalties={parsedScreenplay.penalties}
            category="scenesPeriod"
            title="Periods"
          />
        </>
      )}
      <div className={styles.counterLocation}>
        <Counter
          count={parsedScreenplay.labels.scenes.length}
          legend={
            parsedScreenplay.labels.scenes.length === 1
              ? "location to shoot"
              : "locations to shoot"
          }
          icon="camera"
        />
      </div>
      <Row>
        <HorizontalBarChartCard
          pages={parsedScreenplay.pages}
          penalties={parsedScreenplay.scenesPenalties}
          category="scenes"
        />
      </Row>
      <FirstScene scene={parsedScreenplay.firstScene} />
      <Row>
        <StackedBarChartCard
          pages={parsedScreenplay.pages}
          labels={parsedScreenplay.labels}
          category="scenes"
        />
      </Row>
      <Characters parsedScreenplay={parsedScreenplay} />
      <div className={styles.push} />
      <RowTitle title="Structure" />
      <Row>
        {parsedScreenplay.labels.acts.length > 0 ? (
          <div>
            <p className={styles.actsTitle}>
              The script is divided into{" "}
              <span className={styles.actsCounter}>
                {parsedScreenplay.labels.acts.length}
              </span>{" "}
              part{parsedScreenplay.labels.acts.length > 1 ? "s" : ""}
            </p>
            <StructureChart
              pages={parsedScreenplay.pages}
              acts={parsedScreenplay.labels.acts}
            />
          </div>
        ) : (
          <p className={styles.actsTitle}>No acts detected in the script</p>
        )}
      </Row>
      {parsedScreenplay.dialogQuote.quote && (
        <Row>
          <Quote
            quote={parsedScreenplay.dialogQuote.quote}
            author={parsedScreenplay.dialogQuote.author}
            type="end"
          />
        </Row>
      )}
    </>
  );
};

export default Overview;
