// components/theme-toggle.jsx
"use client";

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react"; // Utilizza icone per indicare il tema

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex items-center">
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5 mr-2" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 mr-2" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
