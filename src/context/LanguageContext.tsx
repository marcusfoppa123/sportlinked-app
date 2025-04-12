
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "sv";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionary of translations
import translations from "../utils/translations";

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if there's a saved language preference in localStorage
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem("sportlinked-language") as Language) || "en"
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sportlinked-language", lang);
  };

  // Translation function - returns the translation for a given key
  const t = (key: string): string => {
    const langStrings = translations[language] || translations.en;
    return langStrings[key] || key;
  };

  useEffect(() => {
    // Update HTML lang attribute when language changes
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
