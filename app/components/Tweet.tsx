"use client";

import { Tweet } from "react-tweet";
import { useEffect, useState } from "react";

function getCurrentTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const pref = localStorage.getItem("theme");
  if (pref === "dark") return "dark";
  if (pref === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function TweetComponent({ id }: { id: string }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => getCurrentTheme());

  useEffect(() => {
    function updateTheme() {
      const newTheme = getCurrentTheme();
      setTheme(newTheme);
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[TweetComponent] Theme updated: ${newTheme}`);
      }
    }
    updateTheme();
    window.addEventListener("storage", updateTheme);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", updateTheme);
    return () => {
      window.removeEventListener("storage", updateTheme);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", updateTheme);
    };
  }, []);

  useEffect(() => {
    // Try to hide the tweet actions after the tweet is rendered
    const hideActions = () => {
      // Try to find the actions bar by a stable selector
      // This may need to be updated if react-tweet changes its structure
      const actions = document.querySelectorAll('[class*="tweet-actions_"]');
      actions.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    };

    // Run after a short delay to ensure the tweet is rendered
    const timeout = setTimeout(hideActions, 100);

    // Optionally, observe for DOM changes if tweets load async
    // (for more robustness, use a MutationObserver)

    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <div data-theme={theme}>
      <Tweet id={id} />
    </div>
  );
}
