import React from "react";
import DataWrapper from "components/data-wrapper";
import DashboardData from "containers/dashboard/main";
import Uploader from "containers/dashboard/uploader";
import styles from "styles/dashboard.module.css";
import useParseScreenplay from "utils/pdf-parser/useParseScreenplay";

const Dashboard = () => {
  const {
    parsedScreenplay,
    parsedCharacter,
    loading,
    error,
    settings,
    preview,
    onParseScreenplay,
    onParseCharacter,
    onReset,
    onResetCharacter,
    onChangeSettings,
  } = useParseScreenplay();

  return (
    <div>
      <section className={styles.container}>
        <DataWrapper
          loading={loading}
          error={error as string}
          onReset={() => onReset()}
        >
          {parsedScreenplay ? (
            <DashboardData
              parsedScreenplay={parsedScreenplay}
              parsedCharacter={parsedCharacter}
              onClearPage={() => onReset()}
              settings={settings}
              onChangeSettings={onChangeSettings}
              onParseCharacter={onParseCharacter}
              onLeaveCharacterPage={() => onResetCharacter()}
              preview={preview}
            />
          ) : (
            <Uploader onParseScreenplay={onParseScreenplay} />
          )}
        </DataWrapper>
      </section>
    </div>
  );
};

export default Dashboard;
