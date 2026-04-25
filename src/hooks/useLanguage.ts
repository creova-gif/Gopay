import { useState, useCallback } from 'react';
import { type Language, type CopyKey, t as translate } from '../design-system/tokens';

const STORAGE_KEY = 'gopay_lang';

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'sw') return stored;
  } catch {}
  return 'sw'; // Swahili first
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getInitialLang);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'sw' ? 'en' : 'sw');
  }, [language, setLanguage]);

  const t = useCallback((key: CopyKey) => translate(key, language), [language]);

  return { language, setLanguage, toggleLanguage, t };
}
