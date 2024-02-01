'use client'
import { createContext, ReactElement, useContext, useEffect, useState, SetStateAction } from "react";

interface ThemeContextProps {
    children: ReactElement;
}

type ThemeContextData = {
    theme: boolean;
    setTheme: React.Dispatch<SetStateAction<boolean>>;
};

const ThemeContext = createContext({} as ThemeContextData);

/**
 * Widget configuration https://www.tradingview.com/widget/advanced-chart/
 */
export function ThemeContextProvider({ children }: ThemeContextProps) {
    const [theme, setTheme] = useState(() => (typeof window !== "undefined" ? localStorage.theme === "light" : true));

    useEffect(() => {
        setTheme(localStorage.theme === "light");
    }, []);

    useEffect(() => {
        const rootElement = window.document.documentElement;
        const currentTheme = theme;

        const prevTheme = currentTheme ? "dark" : "light";
        rootElement.classList.remove(prevTheme);

        const nextTheme = currentTheme ? "light" : "dark";
        rootElement.classList.add(nextTheme);

        localStorage.setItem("theme", nextTheme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
