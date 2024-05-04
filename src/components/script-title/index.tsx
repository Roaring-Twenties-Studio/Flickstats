import React, {
  useCallback,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";
import Button from "components/button";
import UserGear from "components/icons/user-gear-white.svg";
import Back from "components/icons/arrow-left.svg";
import Trash from "components/icons/trash.svg";
import Filters from "components/icons/filters.svg";
import styles from "./script-title.module.css";
import ButtonLoader from "components/loader/button";

interface IProps {
  title: string;
  onLeaveCharacterPage: () => void;
  onOpenCharacters: () => void;
  onClearPage: () => void;
  onOpenSettings: () => void;
}

export default function ScripTitle({
  title,
  onLeaveCharacterPage,
  onOpenCharacters,
  onClearPage,
  onOpenSettings,
}: IProps) {
  const [schrinkNavbar, setSchrinkNavbar] = useState(false);
  const [isGoingBack, startBackTransition] = useTransition();
  const [isOpeningSettings, startSettingsTransition] = useTransition();
  const [isOpeningCharacters, startCharactersTransition] = useTransition();
  const onScroll = useCallback(() => {
    const { scrollY } = window;
    if (scrollY > 40 && !schrinkNavbar) {
      return setSchrinkNavbar(true);
    }
    if (scrollY < 40 && schrinkNavbar) {
      return setSchrinkNavbar(false);
    }
    return null;
  }, [setSchrinkNavbar, schrinkNavbar]);

  useLayoutEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <div className={`${styles.pageTitle} ${schrinkNavbar && styles.schrink}`}>
      <span className={styles.title}>
        {!!onLeaveCharacterPage && (
          <span className={styles.characterButton}>
            <div className={`${styles.tooltip} ${styles.tooltipBack}`}>
              Return to the main dashboard
            </div>
            <Button
              icon={
                isGoingBack ? (
                  <ButtonLoader />
                ) : (
                  <Back
                    width={schrinkNavbar ? 16 : 24}
                    height={schrinkNavbar ? 16 : 24}
                  />
                )
              }
              onClick={() => startBackTransition(() => onLeaveCharacterPage())}
              variant="tertiary"
              type="button"
            />
          </span>
        )}
        <span className={styles.scriptTitle}>{title}</span>
      </span>
      <span className={styles.actionButtons}>
        <div>
          <Button
            icon={
              isOpeningCharacters ? (
                <ButtonLoader />
              ) : (
                <UserGear width={20} height={20} />
              )
            }
            onClick={() => startCharactersTransition(() => onOpenCharacters())}
            variant="tertiary"
            type="button"
          />
        </div>
        <Button
          icon={
            isOpeningSettings ? (
              <ButtonLoader />
            ) : (
              <Filters width={16} height={16} />
            )
          }
          onClick={() => startSettingsTransition(() => onOpenSettings())}
          variant="tertiary"
          type="button"
        />
        <Button
          icon={<Trash width={16} height={16} />}
          onClick={onClearPage}
          variant="tertiary"
          type="reset"
        />
      </span>
    </div>
  );
}
