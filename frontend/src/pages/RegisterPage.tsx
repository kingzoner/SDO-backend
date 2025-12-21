import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGroupNames, useRegister } from '../api/hooks'
import type { Role } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import { getErrorMessage } from '../utils/error'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const registerMutation = useRegister()
  const groupsQuery = useGroupNames()
  const { t } = useI18n()

  const [hasNoMiddleName, setHasNoMiddleName] = useState(false)
  const [error, setError] = useState<string>('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    username: '',
    password: '',
    group_name: '',
  })

  useEffect(() => {
    if (!form.group_name && groupsQuery.data?.length) {
      setForm((prev) => ({ ...prev, group_name: groupsQuery.data?.[0] ?? '' }))
    }
  }, [form.group_name, groupsQuery.data])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    registerMutation.mutate(form, {
      onSuccess: (data) => {
        const role = (data.role ?? 'unknown') as Role
        setAuth(data.access_token, role)
        navigate(role === 'teacher' ? '/teacher' : '/subjects')
      },
      onError: (err) => setError(getErrorMessage(err)),
    })
  }

  return (
    <section className="auth-section">
      <h1 className="auth-heading">{t('auth.registration.title')}</h1>
      <form className="auth-form" onSubmit={handleSubmit} method="post">
        <input
          type="text"
          placeholder={t('auth.registration.lastName')}
          name="last_name"
          value={form.last_name}
          className="section__login-formInput"
          onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder={t('auth.registration.firstName')}
          name="first_name"
          value={form.first_name}
          className="section__login-formInput"
          onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder={t('auth.registration.middleName')}
          name="middle_name"
          value={form.middle_name}
          className="section__login-formInput"
          onChange={(e) => setForm((prev) => ({ ...prev, middle_name: e.target.value }))}
          disabled={hasNoMiddleName}
        />

        <div className="auth-checkbox">
          <input
            type="checkbox"
            id="noMiddleName"
            checked={hasNoMiddleName}
            onChange={(e) => {
              const checked = e.target.checked
              setHasNoMiddleName(checked)
              setForm((prev) => ({ ...prev, middle_name: checked ? '-' : '' }))
            }}
          />
          <label htmlFor="noMiddleName">{t('auth.registration.noMiddleName')}</label>
        </div>

        <input
          type="text"
          placeholder={t('auth.registration.username')}
          name="username"
          value={form.username}
          className="section__login-formInput"
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder={t('auth.registration.password')}
          name="password"
          value={form.password}
          className="section__login-formInput"
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        <select
          name="group_name"
          value={form.group_name}
          className="section__login-formSelect"
          onChange={(e) => setForm((prev) => ({ ...prev, group_name: e.target.value }))}
          required
        >
          {groupsQuery.isLoading && <option value="">{t('auth.registration.loadingGroups')}</option>}
          {groupsQuery.isError && <option value="">{t('auth.registration.failedGroups')}</option>}
          {!groupsQuery.isLoading &&
            !groupsQuery.isError &&
            (groupsQuery.data?.length ? (
              groupsQuery.data.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))
            ) : (
              <option value="">{t('auth.registration.noGroups')}</option>
            ))}
        </select>

        <button type="submit" className="auth-button" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? t('auth.registration.submitPending') : t('auth.registration.submit')}
        </button>
      </form>
      {error && <h2 className="auth-error">{error}</h2>}
    </section>
  )
}

export default RegisterPage
