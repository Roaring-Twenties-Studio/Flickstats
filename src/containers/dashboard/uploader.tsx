import React, { useState } from "react";
import PDFFile from "components/icons/pdf-file.svg";
import { routes } from "router/routes";
import styles from "./dashboard-container.module.css";

interface IProps {
  onParseScreenplay: (screenplay: File) => void;
}

const DashboardUploader = ({ onParseScreenplay }: IProps) => {
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const onAddPDF = (data: File) => {
    if (!data) {
      return null;
    }
    const isPDFFormat = data.type === "application/pdf";
    if (!isPDFFormat) {
      return setError("Please upload your script as a PDF");
    }
    const isTooLarge = data.size > 4_000_000; // 4mb max
    if (isTooLarge) {
      return setError(
        `Your script weighs ${
          data.size / 1_000_000
        }mb. The maximum size allowed is 4mb.`
      );
    }
    return onParseScreenplay(data);
  };

  return (
    <div className={styles.rootUploader}>
      <div className={styles.banner}>
        Flickstats is a free and open-source software. If you like it, please
        consider{" "}
        <a href={routes.buy} target="_blank" rel="noreferrer">
          supporting
        </a>{" "}
        us.
      </div>
      <div
        className={`${styles.inputWrapper} ${
          isDragging && styles.inputDragging
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <input
          className={styles.inputFile}
          type="file"
          title=""
          //@ts-ignore
          onChange={(e) => onAddPDF(e.target.files[0])}
        />
        <PDFFile width={120} height={120} />
      </div>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <p className={styles.dragNDrop}>
          Drag and drop your script in PDF format
        </p>
      )}
    </div>
  );
};

export default DashboardUploader;
