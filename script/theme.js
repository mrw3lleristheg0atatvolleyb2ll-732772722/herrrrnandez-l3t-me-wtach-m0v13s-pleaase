(function () {
  const THEME_KEY = "current_theme";
  const FONT_KEY = "current_font";
  const CUSTOM_CONFIG_KEY = "custom_theme_config";
  const DEFAULT_THEME = "vapor";

  window.applyVtheme = () => {
    return new Promise((resolve) => {
      const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
      const root = document.documentElement;

      const vars = [
        "--bg",
        "--secondary-bg",
        "--third-bg",
        "--fourth-bg",
        "--primary",
        "--secondary",
        "--text-color",
        "--secondary-text-color",
        "--button-bg",
        "--button-hover",
        "--gradient-start",
        "--gradient-end",
        "--accent",
        "--cb",
        "--bc",
      ];

      if (theme === "custom") {
        const customConfig = JSON.parse(
          localStorage.getItem(CUSTOM_CONFIG_KEY) || "{}"
        );

        vars.forEach((v) => {
          if (customConfig[v]) {
            root.style.setProperty(v, customConfig[v]);
          }
        });

        root.setAttribute("data-theme", "custom");
        resolve();
        return;
      }

      vars.forEach((v) => {
        root.style.removeProperty(v);
      });

      const isAlt = localStorage.getItem("is_alt_theme") === "true";
      const folder = isAlt ? "alt-theme" : "theme";
      const themePath = `/style/${folder}/${theme}.css`;

      document.documentElement.setAttribute("data-theme", theme);

      let themeLink = document.getElementById("theme-link");
      if (!themeLink) {
        themeLink = document.createElement("link");
        themeLink.id = "theme-link";
        themeLink.rel = "stylesheet";
        document.head.appendChild(themeLink);
      }

      const timeout = setTimeout(resolve, 1500);
      themeLink.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      themeLink.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };

      themeLink.href = themePath;
    });
  };

  window.applyVfont = () => {
    const fontName = localStorage.getItem(FONT_KEY);
    let styleEl = document.getElementById("dynamic-font-style");
    if (
      !fontName ||
      fontName.trim() === "" ||
      fontName.toLowerCase() === "default"
    ) {
      if (styleEl) styleEl.remove();
      return;
    }
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      "+"
    )}:wght@400;700&display=swap`;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "dynamic-font-style";
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `@import url('${fontUrl}'); * { font-family: '${fontName}', sans-serif !important; }`;
  };

  applyVtheme();
  applyVfont();

  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY || e.key === CUSTOM_CONFIG_KEY) applyVtheme();
    if (e.key === FONT_KEY) applyVfont();
  });
})();
