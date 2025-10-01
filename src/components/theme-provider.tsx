'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  const nextTheme = useNextTheme()
  
  if (context === undefined) {
    // Fallback to next-themes when context is not available
    return {
      theme: nextTheme.theme as Theme,
      setTheme: nextTheme.setTheme as (theme: Theme) => void
    }
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme: setNextTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider value={{ theme: theme as Theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
