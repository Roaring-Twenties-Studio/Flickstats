import React, { useCallback, useRef, useState } from "react";
import { PDFPageProxy } from "pdfjs-dist";
import Filters from "components/icons/filters.svg";
import LineBreakOption from "components/line-break-option";
import Modal from "components/modal";
import PageCanvas from "components/page-canvas";
import type { Settings } from "models/screenplay";
import { DEFAULT_SETTINGS } from "utils/pdf/settings";
import styles from "./style.module.css";
import { useDrawPDF } from "./useDrawPDF";

interface IProps {
  onClose: () => void;
  open: boolean;
  titlePage: PDFPageProxy;
  dialogPage: PDFPageProxy;
  onChangeSettings: (settings: Settings) => Promise<void>;
  settings: Settings;
}

const PAGE_TOP_Y = 842;

function Title() {
  return (
    <div className={styles.title}>
      <Filters width={24} height={24} />
      <span>Settings</span>
    </div>
  );
}

export default function FiltersModal({
  open,
  settings,
  titlePage,
  dialogPage,
  onClose,
  onChangeSettings,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<"page" | "title">("page");
  const [draft, setDraft] = useState({
    ...settings,
    Y_CENTER_STARTING_POSITION: Math.abs(
      settings.Y_CENTER_STARTING_POSITION - PAGE_TOP_Y
    ),
  });
  const canvasRef = useRef(null);
  const { isError } = useDrawPDF({
    page: preview === "title" ? titlePage : dialogPage,
    canvasRef,
    open,
  });

  const onChangeLine = useCallback((line: keyof Settings, value: number) => {
    return setDraft((prev) => ({ ...prev, [line]: value }));
  }, []);

  const onChangeLineBreak = useCallback((forceLineBreak: boolean) => {
    return setDraft((prev) => ({ ...prev, forceLineBreak }));
  }, []);

  const onValidate = async () => {
    setLoading(true);
    await onChangeSettings({
      ...draft,
      Y_CENTER_STARTING_POSITION: Math.abs(
        draft.Y_CENTER_STARTING_POSITION - PAGE_TOP_Y
      ),
    });
    setLoading(false);
    window.scrollTo(0, 0);
    onClose();
  };

  const onResetSettings = () => {
    setDraft({
      ...DEFAULT_SETTINGS,
      Y_CENTER_STARTING_POSITION: Math.abs(
        DEFAULT_SETTINGS.Y_CENTER_STARTING_POSITION - PAGE_TOP_Y
      ),
    });
  };

  const onCancel = () => {
    setDraft({
      ...settings,
      Y_CENTER_STARTING_POSITION: Math.abs(
        settings.Y_CENTER_STARTING_POSITION - PAGE_TOP_Y
      ),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      content={
        <>
          <PageCanvas
            onChangeLine={onChangeLine}
            settings={draft}
            onReset={onResetSettings}
            ref={canvasRef}
            preview={preview}
            setPreview={setPreview}
            error={isError}
          />
          <LineBreakOption
            forceLineBreak={draft.forceLineBreak}
            onChange={onChangeLineBreak}
          />
        </>
      }
      title={<Title />}
      onValidate={onValidate}
      isLoading={loading}
    />
  );
}
