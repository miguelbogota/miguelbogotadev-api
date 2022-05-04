import { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import createContext from '@app-lib/create-context';
import jsCookie from 'js-cookie';

/** Hook uses an isomorphic layout effect to check if is SSR or in client. */
const useIsomorphicLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Type with the available themes for the system. */
export type SystemTheme = 'light' | 'dark';

/** Props for the provider of the theme. */
export type AppThemeProviderProps = {
  system: SystemTheme;
};

/** Context with the values to keep track across the app. */
const ctx = createContext({
  useValue: ({ system }: AppThemeProviderProps) => {
    const [theme, setTheme] = useState(system);
    return useMemo(() => ({ theme, setTheme }), [theme]);
  },
});

/** Provider for the values of the theme of the app. */
export const AppThemeProvider = ctx.createProvider('AppThemeProvider');

/** Color schemas in available in the browser. */
const colors = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)',
};

/**
 * Hook will return multiple values related to the theme (theme, systemTheme, userSelectedTheme and
 * a set function), to keep track of it across the app.
 */
const useAppTheme = () => {
  const { theme, setTheme } = ctx.useValue();

  /** Function will update the system theme and the cookie on change. */
  const _setSystemTheme = (newTheme: SystemTheme) => {
    // Store the new value in a cookie to keep track in SSR.
    jsCookie.set('system-theme', newTheme);
    setTheme(newTheme);
  };

  /** Function validates if is the correct event and update the system theme. */
  const onSystemThemeChange = (newTheme: SystemTheme) => (event: MediaQueryListEvent) => {
    if (!event || !event.matches) return;
    _setSystemTheme(newTheme);
  };

  useEffect(() => {
    // Makes sure browser supports matchmedias function and is the first call in `_app.tsx`.
    if (!window.matchMedia) return;

    const lightMatch = window.matchMedia(colors.light);
    const onLightMatches = onSystemThemeChange('light');
    lightMatch.addEventListener('change', onLightMatches);

    const darkMatch = window.matchMedia(colors.dark);
    const onDarkMatches = onSystemThemeChange('dark');
    darkMatch.addEventListener('change', onDarkMatches);

    return () => {
      lightMatch.removeEventListener('change', onLightMatches);
      darkMatch.removeEventListener('change', onDarkMatches);
    };
  }, []);

  useIsomorphicLayout(() => {
    // Makes sure browser supports matchmedias function and is the first call in `_app.tsx`.
    if (!window.matchMedia) return;
    // Set default values in the cookies if there isn't any cookie set.
    if (!jsCookie.get('system-theme')) {
      jsCookie.set('user-selected-theme', 'system');
      jsCookie.set('system-theme', 'light');
    }

    // Assign initial values.
    const isDarkTheme = window.matchMedia(colors.dark).matches && theme !== 'dark';
    const isLightTheme = window.matchMedia(colors.light).matches && theme !== 'light';

    if (isDarkTheme) _setSystemTheme('dark');
    else if (isLightTheme) _setSystemTheme('light');
  }, [theme]);

  return theme;
};

export default useAppTheme;
