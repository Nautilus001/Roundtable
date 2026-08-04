export interface Palette {
    lightPrimary: string,
    darkPrimary: string,
    lightSecondary: string,
    darkSecondary: string,
    random: string
}

export interface LayoutTokens {
    spacing: {
        xs: number,
        sm: number,
        md: number,
        lg: number,
        xl: number
    },
    radius: {
        sm: number,
        md: number,
        lg: number
    },
}

const layout1: LayoutTokens = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 4,
        md: 8,
        lg: 16
    }
}

const layout2: LayoutTokens = {
    spacing: {
        xs: 3,
        sm: 9,
        md: 12,
        lg: 21,
        xl: 36,
    },
    radius: {
        sm: 3,
        md: 9,
        lg: 21
    }
}

export const LAYOUTS: LayoutTokens[] = [layout1, layout2]

const baseColors = {
  gray100: '#F3F4F6',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
  black: '#000000',
};

const palette1: Palette = {
    lightPrimary: '#EACEAA',
    darkSecondary: '#85431E',
    lightSecondary: '#D39858',
    random: '#34150F',
    darkPrimary: '#150C0C'
}

const palette2: Palette = {
    darkPrimary: '#0c0a03',
    darkSecondary: '#3f0e04',
    lightSecondary: '#a24112',
    random: '#47632b',
    lightPrimary: '#df9a5a'
}

const palette3: Palette = {
    lightPrimary: "#A08C69",
    lightSecondary: "#C17D5F",
    darkPrimary: "#3A2F22",
    darkSecondary: "#553E2A",
    random: "#6D724D"
}

export const getLightTheme = (palette: Palette, layout: LayoutTokens) => ({
  ...layout,
  colors: {
    background: baseColors.gray100,
    surface: baseColors.white,
    textPrimary: baseColors.gray900,
    textSecondary: baseColors.gray800,
    primary: palette.lightPrimary,
    secondary: palette.lightSecondary,
    accent: palette.random,
    border: '#E5E7EB',
  },
})

export type Theme = typeof getLightTheme

export const getDarkTheme: Theme = (palette: Palette, layout: LayoutTokens) => ({
  ...layout,
  colors: {
    background: baseColors.gray900,
    surface: baseColors.gray800,
    textPrimary: baseColors.white,
    textSecondary: baseColors.gray100,
    primary: palette.darkPrimary,
    secondary: palette.darkSecondary,
    accent: palette.random,
    border: '#374151',
  },
})

export const PALETTES: Palette[] = [palette1, palette2, palette3]

