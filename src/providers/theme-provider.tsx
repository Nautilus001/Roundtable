import {getDarkTheme, getLightTheme, LAYOUTS, PALETTES} from '@/constants/theme';
import {ThemeContext, ThemeMode} from '@/contexts/theme-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

const MODE_STORAGE_KEY = '@user_theme_mode';
const PALETTE_STORAGE_KEY = '@user_palette_index';
const LAYOUT_STORAGE_KEY = '@user_layout_index';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceScheme = useDeviceColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [paletteIndex, setPaletteIndexState] = useState<number>(0);
  const [layoutIndex, setLayoutIndexState] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(MODE_STORAGE_KEY),
      AsyncStorage.getItem(PALETTE_STORAGE_KEY),
      AsyncStorage.getItem(LAYOUT_STORAGE_KEY),
    ]).then(([savedMode, savedPaletteIndex, savedLayoutIndex]) => {
      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
        setModeState(savedMode);
      }
      if (savedPaletteIndex !== null) {
        const parsed = parseInt(savedPaletteIndex, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < PALETTES.length) {
          setPaletteIndexState(parsed);
        }
      }
      if (savedLayoutIndex !== null) {
        const parsed = parseInt(savedLayoutIndex, 10);
        if(!isNaN(parsed) && parsed >= 0 && parsed < LAYOUTS.length) {
            setLayoutIndexState(parsed)
        }
      }
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(MODE_STORAGE_KEY, newMode);
  };

  const setPaletteIndex = (index: number) => {
    const safeIndex = index % PALETTES.length;
    setPaletteIndexState(safeIndex);
    AsyncStorage.setItem(PALETTE_STORAGE_KEY, safeIndex.toString());
  };

  const setLayoutIndex = (index: number) => {
    const safeIndex = index % LAYOUTS.length;
    setLayoutIndexState(safeIndex);
    AsyncStorage.setItem(LAYOUT_STORAGE_KEY, safeIndex.toString());
  };

  const cyclePalette = () => {
    const nextIndex = (paletteIndex + 1) % PALETTES.length;
    setPaletteIndex(nextIndex);
  };

  const cycleLayout = () => {
    const nextIndex = (paletteIndex + 1) % LAYOUTS.length;
    setLayoutIndex(nextIndex);
  }

  const activeScheme = mode === 'system' ? deviceScheme ?? 'light' : mode;
  const isDark = activeScheme === 'dark';
  
  const activePalette = PALETTES[paletteIndex];
  const activeLayout = LAYOUTS[layoutIndex];
  const theme = isDark ? getDarkTheme(activePalette, activeLayout) : getLightTheme(activePalette, activeLayout);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        isDark,
        activePalette,
        paletteIndex,
        setMode,
        cyclePalette,
        setPaletteIndex,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};