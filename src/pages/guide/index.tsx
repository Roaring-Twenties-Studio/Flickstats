import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "components/accordion";
import Button from "components/button";
import data from "data/faq.json";
import { routes } from "router/routes";
import styles from "./style.module.css";

export default function Guide() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number>();
  return (
    <div>
      <section className={styles.container}>
        <>
          <h3 className={styles.title}>Guide</h3>
          <div className={styles.blocks}>
            {data.map((block) => (
              <Accordion
                key={block.id}
                id={block.id}
                title={block.title}
                isOpen={open === block.id}
                onClick={setOpen}
              >
                {block.text}
              </Accordion>
            ))}
          </div>
          <Button
            label="Return to main page"
            onClick={() => navigate(routes.home)}
            variant="secondary"
          />
        </>
      </section>
    </div>
  );
}
