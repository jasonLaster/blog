"use client";

import { useEffect, useRef } from "react";

interface TableWidthAdjusterProps {
  containerSelector: string;
}

const TableWidthAdjuster: React.FC<TableWidthAdjusterProps> = ({
  containerSelector,
}) => {
  const styleTagRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    console.log(
      `TableWidthAdjuster: Running effect for selector: ${containerSelector}`
    );
    const containerElement = document.querySelector(containerSelector);

    if (!containerElement) {
      console.warn(
        `TableWidthAdjuster: Container element not found for selector: ${containerSelector}`
      );
      return;
    }

    const thElements = Array.from(
      containerElement.querySelectorAll("thead th[data-start][data-end]")
    ) as HTMLElement[];

    if (thElements.length === 0) {
      console.warn(
        `TableWidthAdjuster: No <th> elements with data-start/end found within ${containerSelector}`
      );
      return;
    }

    const ranges: { start: number; end: number }[] = [];
    thElements.forEach((th) => {
      const startAttr = th.getAttribute("data-start");
      const endAttr = th.getAttribute("data-end");
      if (startAttr && endAttr) {
        const start = parseInt(startAttr, 10);
        const end = parseInt(endAttr, 10);
        if (!isNaN(start) && !isNaN(end) && end > start) {
          ranges.push({ start, end });
        } else {
          console.warn(
            "TableWidthAdjuster: Found invalid data-start/end attributes on:",
            th
          );
        }
      } else {
        console.warn(
          "TableWidthAdjuster: Missing data-start/end attributes on:",
          th
        );
      }
    });

    if (ranges.length !== thElements.length) {
      console.warn(
        "TableWidthAdjuster: Mismatch between found th elements and valid ranges."
      );
      // Proceeding with valid ranges found, might result in incorrect layout if some columns are missed.
    }

    if (ranges.length === 0) {
      console.warn(
        `TableWidthAdjuster: No valid data ranges extracted from <th> elements.`
      );
      return;
    }

    const widths = ranges.map((range) => range.end - range.start);
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    if (totalWidth <= 0) {
      console.warn(
        `TableWidthAdjuster: Total calculated width is zero or negative.`
      );
      return;
    }

    const percentages = widths.map((w) => (w / totalWidth) * 100);

    // Generate CSS rules scoped to the specific container
    let cssRules = "";
    percentages.forEach((perc, index) => {
      const n = index + 1;
      cssRules += `\n      ${containerSelector} th:nth-child(${n}),\n      ${containerSelector} td:nth-child(${n}) {\n        width: ${perc.toFixed(
        1
      )}%;\n      }\n    `;
    });

    console.log("TableWidthAdjuster: Generated dynamic width CSS:", cssRules);

    // Create or update the style tag
    if (!styleTagRef.current) {
      styleTagRef.current = document.createElement("style");
      document.head.appendChild(styleTagRef.current);
    }
    styleTagRef.current.innerHTML = cssRules;

    // Cleanup function to remove the style tag
    return () => {
      if (styleTagRef.current) {
        console.log(
          `TableWidthAdjuster: Cleaning up styles for selector: ${containerSelector}`
        );
        styleTagRef.current.remove();
        styleTagRef.current = null;
      }
    };
  }, [containerSelector]); // Rerun if the selector changes

  return null; // This component doesn't render anything itself
};

export default TableWidthAdjuster;
