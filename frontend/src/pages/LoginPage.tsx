import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogin } from '../api/hooks'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import { getErrorMessage } from '../utils/error'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const loginMutation = useLogin()
  const { t } = useI18n()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState<string>('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    loginMutation.mutate(form, {
      onSuccess: (data) => {
        setAuth(data.access_token, data.role ?? null)
        navigate('/subjects')
      },
      onError: (err) => setError(getErrorMessage(err)),
    })
  }

  return (
    <section className="auth-section">
      <h1 className="auth-heading">{t('auth.login.title')}</h1>
      <form className="auth-form" onSubmit={handleSubmit} method="post">
        <input
          type="text"
          placeholder={t('auth.login.usernamePlaceholder')}
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          value={form.username}
          className="section__login-formInput"
          name="username"
          required
        />
        <input
          type="password"
          placeholder={t('auth.login.passwordPlaceholder')}
          name="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="section__login-formInput"
          required
        />
        <div className="auth-buttons">
          <button type="submit" className="auth-button" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? t('auth.login.submitPending') : t('auth.login.submit')}
          </button>
          <button type="button" className="auth-button" onClick={() => navigate('/registration')}>
            {t('auth.login.registrationButton')}
          </button>
        </div>
      </form>
      {error && <h2 className="auth-error">{error}</h2>}
    </section>
  )
}

export default LoginPage
