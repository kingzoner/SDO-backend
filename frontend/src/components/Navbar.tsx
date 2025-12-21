import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import logo from '../assets/logo.svg'

const Navbar = () => {
  const { token, role, logout } = useAuth()
  const { language, setLanguage, t } = useI18n()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label={t('breadcrumb.home')}>
          <img src={logo} alt="SDO" />
        </Link>
        <nav className="navbar-nav">
          <div className="lang-toggle" role="group" aria-label={t('lang.label')}>
            <button
              type="button"
              className={`lang-button ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              {t('lang.en')}
            </button>
            <button
              type="button"
              className={`lang-button ${language === 'ru' ? 'active' : ''}`}
              onClick={() => setLanguage('ru')}
            >
              {t('lang.ru')}
            </button>
          </div>
          {token ? (
            <>
              <Link className="header__nav-lr" to="/subjects">
                {t('nav.subjects')}
              </Link>
              {role === 'teacher' && (
                <Link className="header__nav-lr" to="/teacher">
                  {t('nav.teacher')}
                </Link>
              )}
              <button type="button" className="header__nav-lr" onClick={logout}>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link className="header__nav-lr" to="/login">
              {t('nav.login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
