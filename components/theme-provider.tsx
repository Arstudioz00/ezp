"use client";

import { createContext, useContext, useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"

const ThemeProviderContext = createContext<{ theme: string | undefined; setTheme: (theme: string) => void }>({
  theme: undefined,
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useNextTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}