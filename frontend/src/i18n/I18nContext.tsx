import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Language, TranslationKey } from './translations'
import { translations } from './translations'

type Interpolation = Record<string, string | number>

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, vars?: Interpolation) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const LANGUAGE_KEY = 'sdo_lang'

const interpolate = (template: string, vars?: Interpolation) => {
  if (!vars) return template
  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => (vars[key] === undefined ? `{${key}}` : String(vars[key])))
}

const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem(LANGUAGE_KEY)
  if (saved === 'en' || saved === 'ru') return saved
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage())

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    localStorage.setItem(LANGUAGE_KEY, nextLanguage)
    document.documentElement.lang = nextLanguage
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = useCallback(
    (key: TranslationKey, vars?: Interpolation) => {
      const template = translations[language][key] ?? translations.en[key] ?? key
      return interpolate(template, vars)
    },
    [language],
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
