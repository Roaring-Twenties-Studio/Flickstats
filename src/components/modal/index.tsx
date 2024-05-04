import React, { useRef } from "react";
import useBlockScroll from "./useBlockScroll";
import useClickOutside from "./useClickOutside";
import styles from "./modal.module.css";
import Button from "components/button";

interface ModaleProps {
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onValidate: () => void;
  content: React.ReactNode;
  title?: React.ReactNode;
}

export default function Modale({
  open,
  content,
  title,
  isLoading = false,
  onClose,
  onValidate,
}: ModaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  useBlockScroll(open);
  return open ? (
    <div className={styles.backdrop}>
      <div className={styles.centerer}>
        <div className={styles.content} ref={ref}>
          {title}
          {content}
          <div className={styles.buttons}>
            <Button
              label="Cancel"
              onClick={onClose}
              type="reset"
              variant="danger"
            />
            <Button
              label={isLoading ? "Loading..." : "Apply"}
              onClick={onValidate}
              type="submit"
              variant="primary"
              isDisabled={!onValidate}
            />
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
