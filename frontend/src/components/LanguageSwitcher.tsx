import { useLanguage } from '../contexts/LanguageContext'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="lang-switcher">
      <button
        type="button"
        className={lang === 'az' ? 'active' : ''}
        onClick={() => setLang('az')}
      >
        AZ
      </button>
      <button
        type="button"
        className={lang === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  )
}