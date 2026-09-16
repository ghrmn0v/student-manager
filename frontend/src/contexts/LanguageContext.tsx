import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Language, type TranslationKey } from '../translations'

interface LanguageContextValue {
  lang: Language
  t: (key: TranslationKey) => string
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang')
    return saved === 'en' ? 'en' : 'az'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: TranslationKey) => translations[lang][key]

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}