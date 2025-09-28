import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
const ThemeContext = React.createContext({
    theme: 'system',
    setTheme: () => undefined,
});
const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme' }) {
    const [theme, setTheme] = React.useState(() => {
        const stored = localStorage.getItem(storageKey);
        return stored ?? defaultTheme;
    });
    const applyTheme = React.useCallback((next) => {
        const root = document.documentElement;
        const resolved = next === 'system' ? getSystemTheme() : next;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        localStorage.setItem(storageKey, next);
        setTheme(next);
    }, [storageKey]);
    React.useEffect(() => {
        applyTheme(theme);
    }, [applyTheme, theme]);
    React.useEffect(() => {
        if (theme !== 'system') {
            return undefined;
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => applyTheme('system');
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, [theme, applyTheme]);
    const contextValue = React.useMemo(() => ({ theme, setTheme: applyTheme }), [theme, applyTheme]);
    return _jsx(ThemeContext.Provider, { value: contextValue, children: children });
}
export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
