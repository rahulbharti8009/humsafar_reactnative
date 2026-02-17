import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Appearance } from 'react-native';
import { useAppSelector } from '../redux/hook/hook';

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  themeColor: {
    background: string;
    text: string;
    inputBackground: string;
    inputBorder: string;
    googleButtonBorder: string;
    googleButtonText: string;
    navbar: string;
    navbarTextColor: string;
    button_bg_color : string;
    button_text_color : string;
    selectItem: string;
    listitem: string,
    black: string
    white: string
    navbarTextBgColor: string;
    statusbar : string;
    toolbar: string;
    time:string; 
    borderColor: string;
  };
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const user = useAppSelector((state) => state.auth.user)

  const systemTheme = useColorScheme()
  const [theme, setTheme] = useState<string>(systemTheme === 'dark' ? 'dark' : 'light');
  const getThemeColor = () => {
    return {
      background: theme === 'dark' ? '#121212' : '#FFFFFF',
      text: theme === 'dark' ? '#FFFFFF' : '#000000',
      inputBackground: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      inputBorder: theme === 'dark' ? '#444' : '#ccc',
      googleButtonBorder: theme === 'dark' ? '#555' : '#ccc',
      googleButtonText: theme === 'dark' ? '#eee' : '#444',
      button_bg_color: theme === 'dark' ? '#00695C' : '#00695C',
      button_text_color: theme === 'dark' ? '#ffffff' : '#ffffff',
      selectItem: theme === 'dark' ? '#00695C' : '#00695C',
      listitem: theme === 'dark' ? '#444' : '#DBDBDB',
      black: theme === 'dark' ? '#000000' : '#000000',
      white: theme === 'dark' ? '#ffffff' : '#000000',
      navbar: theme === 'dark' ? '#444' : '#DD9C0FFF',//DD9C0FFF
      navbarTextColor: theme === 'dark' ? '#000000' : '#ffffff',
      navbarTextBgColor: theme === 'dark' ? '#ffffff' : '#444',
      statusbar: theme === 'dark' ? '#000000' : '#DD9C0F',
      toolbar: theme === 'dark' ? '#121212' : '#FFFFFF',
      time: theme === 'dark' ? '#ffffff' : '#1A700D',
      borderColor: theme === 'dark' ? '#ffffff' : '#DD9C0FFF',
    };
  };
  const [themeColor, setThemeColor] = useState<any>(getThemeColor());

useEffect(()=> {
  setThemeColor(getThemeColor());
}, [theme])

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setTheme(colorScheme);
      }
    });

    return () => subscription.remove(); // cleanup
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
