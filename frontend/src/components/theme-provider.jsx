// components/theme-provider.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark"); // Imposta "dark" come tema di default

  // Recupera il tema salvato da localStorage al montaggio del componente
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark"); // Tema di default se non c'è alcuna preferenza salvata
    }
  }, []);

  // Applica la classe 'dark' all'elemento <html> e salva la preferenza
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Funzione per alternare il tema
  const toggleTheme = () => {
    setTheme((curr) => (curr === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizzato per usare il ThemeContext
export function useTheme() {
  return useContext(ThemeContext);
}
