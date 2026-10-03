import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'samprt-theme';
const THEME_EVENT = 'samprt:theme-change';
const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_MS = 400;
const DARK_THEME_COLOR = '#16140f';
const LIGHT_THEME_COLOR = '#f6f5f2';

let transitionTimer;

const readThemeFromDom = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateThemeColorMeta = (theme) => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
};

const readStoredTheme = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch {
    return null;
  }
};

/**
 * Applies a theme to <html> and broadcasts it on window so every useTheme()
 * consumer (navbar toggle, terminal, future widgets) stays in sync.
 */
const applyTheme = (nextTheme, { persist = true } = {}) => {
  const theme = nextTheme === 'dark' ? 'dark' : 'light';
  const root = document.documentElement;

  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage can be unavailable (private mode) — the theme still applies */
    }
  }

  if (!prefersReducedMotion()) {
    root.classList.add(TRANSITION_CLASS);
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      root.classList.remove(TRANSITION_CLASS);
    }, TRANSITION_MS);
  }

  root.classList.toggle('dark', theme === 'dark');
  updateThemeColorMeta(theme);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
};

export const useTheme = () => {
  const [theme, setThemeState] = useState(readThemeFromDom);

  useEffect(() => {
    const syncFromEvent = (event) => {
      if (event && (event.detail === 'dark' || event.detail === 'light')) {
        setThemeState(event.detail);
        return;
      }
      setThemeState(readThemeFromDom());
    };

    const syncFromSystem = (event) => {
      if (readStoredTheme()) return; // the visitor picked a theme explicitly
      applyTheme(event.matches ? 'dark' : 'light', { persist: false });
    };

    const syncFromOtherTab = (event) => {
      if (event.key !== STORAGE_KEY) return;
      applyTheme(event.newValue === 'dark' ? 'dark' : 'light', { persist: false });
    };

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    window.addEventListener(THEME_EVENT, syncFromEvent);
    window.addEventListener('storage', syncFromOtherTab);
    media.addEventListener('change', syncFromSystem);

    return () => {
      window.removeEventListener(THEME_EVENT, syncFromEvent);
      window.removeEventListener('storage', syncFromOtherTab);
      media.removeEventListener('change', syncFromSystem);
    };
  }, []);

  const setTheme = useCallback((nextTheme) => {
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }, []);

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
