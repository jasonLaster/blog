"use client";

import { useEffect } from "react";

interface ClassRemoverProps {
  containerSelector: string;
  rawClassToRemove: string;
  contentKey: string; // To re-run effect when HTML content changes
}

export default function ClassRemover({
  containerSelector,
  rawClassToRemove,
  contentKey,
}: ClassRemoverProps) {
  useEffect(() => {
    const selectorForClass = `.${CSS.escape(rawClassToRemove)}`;
    console.debug(
      `[ClassRemover] Effect triggered for container: '${containerSelector}', class: '${rawClassToRemove}', escaped selector: '${selectorForClass}'`
    );

    // Attempt to remove class after a brief delay to allow DOM update
    const timeoutId = setTimeout(() => {
      const renderedContainer = document.querySelector(containerSelector);
      if (renderedContainer) {
        console.debug(
          `[ClassRemover] Container '${containerSelector}' found.`,
          renderedContainer
        );
        try {
          const elements = renderedContainer.querySelectorAll(selectorForClass);
          console.debug(
            `[ClassRemover] Found ${elements.length} elements with selector '${selectorForClass}'.`
          );
          elements.forEach((el) => {
            el.classList.remove(rawClassToRemove);
            console.debug(
              `[ClassRemover] Removed class '${rawClassToRemove}' from:`,
              el
            );
          });
        } catch (error) {
          console.error(
            `[ClassRemover] Error querying or modifying elements with selector '${selectorForClass}':`,
            error
          );
        }
      } else {
        console.warn(
          `[ClassRemover] Container '${containerSelector}' not found.`
        );
      }
    }, 0); // setTimeout with 0ms defers execution until after current call stack clears

    return () => {
      clearTimeout(timeoutId);
    };
  }, [containerSelector, rawClassToRemove, contentKey]);

  return null; // This component does not render anything
}
