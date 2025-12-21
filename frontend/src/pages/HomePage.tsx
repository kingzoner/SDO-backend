import { useI18n } from '../i18n/I18nContext'

const HomePage = () => {
  const { t } = useI18n()

  return (
    <section className="home-section">
      <div className="home-hero">
        <h1>SDO</h1>
        <p>{t('home.tagline')}</p>
      </div>
    </section>
  )
}

export default HomePage
