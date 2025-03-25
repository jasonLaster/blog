export const themeEffect = function () {
  // `null` preference implies system (auto)
  const pref = localStorage.getItem("theme");

  if (null === pref) {
    document.documentElement.classList.add("theme-system");
  } else {
    document.documentElement.classList.remove("theme-system");
  }

  if (
    pref === "dark" ||
    (!pref && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("pause-transitions");
    document.documentElement.classList.add("dark");
    document.head
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", "oklch(.21 .006 285.885)");

    requestAnimationFrame(() => {
      document.documentElement.classList.remove("pause-transitions");
    });
    return "dark";
  } else {
    document.documentElement.classList.add("pause-transitions");
    document.documentElement.classList.remove("dark");
    document.head
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", "oklch(.985 .002 247.839);");
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("pause-transitions");
    });
    return "light";
  }
};
