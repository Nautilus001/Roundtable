import {LayoutTokens, Palette, Theme} from '@/constants/theme'
import { createContext } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  activePalette: Palette;
  paletteIndex: number;
  activeLayout: LayoutTokens
  layoutIndex: number;
  setMode: (mode: ThemeMode) => void;
  cyclePalette: () => void;
  cycleLayout: () => void;
  setPaletteIndex: (index: number) => void;
  setLayoutIndex: (index: number) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
