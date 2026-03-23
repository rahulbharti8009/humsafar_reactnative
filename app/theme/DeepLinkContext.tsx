import React, { createContext, useContext, useState, ReactNode } from 'react';

interface deeplinkContextProps {
  deeplinkUrl: string;
  setDeeplinkUrl: (message: string) => void;
}

const DeepLinkContext = createContext<deeplinkContextProps | undefined>(undefined);

export const DeepLinkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [deeplinkUrl, setDeeplinkUrl] = useState<string>('');
  return (
    <DeepLinkContext.Provider value={{ deeplinkUrl, setDeeplinkUrl }}>
      {children}
    </DeepLinkContext.Provider>
  );
};

export const useDeepLink = () => {
  const context = useContext(DeepLinkContext);
  if (!context) throw new Error('useDeepLink must be used within a ThemeProvider');
  return context;
};
