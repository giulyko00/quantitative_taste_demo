"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"   // imposta class="dark" o class="light" su <html>
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
