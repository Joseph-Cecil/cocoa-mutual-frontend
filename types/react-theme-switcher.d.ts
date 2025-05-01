declare module 'react-theme-switcher' {
    import React from 'react';
  
    export interface ThemeProviderProps {
      children: React.ReactNode;
      themeMap: { [key: string]: string };
      defaultTheme?: string;
      storageKey?: string;
      onChangeTheme?: (theme: string) => void;
    }
  
    export const ThemeProvider: React.FC<ThemeProviderProps>;
  }
  