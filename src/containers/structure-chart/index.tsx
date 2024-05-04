import React, { useMemo } from "react";
import Card from "components/card";
import StructureChart from "components/structure-chart";
import { getRandomColor } from "models/chart";
import { ParsedScreenplay } from "models/screenplay";

interface IProps {
  pages: ParsedScreenplay["pages"];
  acts: ParsedScreenplay["labels"]["acts"];
}

const formatData = (
  chunks: number[],
  labels: ParsedScreenplay["labels"]["acts"]
): { width: string; color: string; label: string; legend: string }[] => {
  const res = [];
  const colors = [];
  if (chunks.length === 0) {
    return res;
  }
  if (chunks.length === 1) {
    return [
      {
        width: "100%",
        color: getRandomColor(colors),
        label: labels[0],
        legend: `page 1 to ${chunks[0]}`,
      },
    ];
  }
  if (chunks.length === 2) {
    return [
      {
        width: "100%",
        color: getRandomColor(colors),
        label: labels[0],
        legend: `page 1 to ${chunks[1]}`,
      },
    ];
  }
  let currentWidth = 0;
  chunks.forEach((chunk, i) => {
    if (i + 1 === chunks.length) {
      return;
    } else {
      const max = chunks[chunks.length - 1];
      const range = chunks[i + 1] - chunk || 1; // if 0, it means the whole act is on a single page, so use 1 to get a percentage
      // when we reach the penultimate chunk, we know it's the last chunk to be displayed because this color chunk block = this page up to the last.
      // so we just give it the remaining width available to fill 100%.
      const width =
        i === chunks.length - 2 ? 100 - currentWidth : (range * 100) / max;
      const color = getRandomColor(colors);
      colors.push(color);
      currentWidth += width;
      return res.push({
        width: `${width.toFixed(1)}%`,
        color,
        label: labels[i],
        legend: `page ${chunks[i]} to ${chunks[i + 1]}`,
      });
    }
  });
  return res;
};

export default function StructureChartCard({ pages, acts }: IProps) {
  const actChunks: number[] = pages
    .reduce((acc, page) => {
      if (page.isNewAct) {
        acc.push(page.page);
      }
      return acc;
    }, [])
    .concat(pages.length);

  const formatedData = useMemo(
    () => formatData(actChunks, acts),
    [actChunks, acts]
  );

  return (
    <Card>
      <StructureChart data={formatedData} />
    </Card>
  );
}
