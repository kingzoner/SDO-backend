import { Link, useLocation } from 'react-router-dom'

import { useI18n } from '../i18n/I18nContext'
import type { TranslationKey } from '../i18n/translations'

const LABEL_KEYS: Record<string, TranslationKey> = {
  login: 'breadcrumb.login',
  register: 'breadcrumb.register',
  registration: 'breadcrumb.registration',
  subjects: 'breadcrumb.subjects',
  tasks: 'breadcrumb.tasks',
  teacher: 'breadcrumb.teacher',
}

const isNumeric = (value: string) => /^\d+$/.test(value)

const getLabel = (
  segment: string,
  previousSegment: string | undefined,
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string,
) => {
  if (isNumeric(segment)) {
    if (previousSegment === 'subjects') return t('breadcrumb.subject', { id: segment })
    if (previousSegment === 'tasks') return t('breadcrumb.task', { id: segment })
    return `#${segment}`
  }

  const key = LABEL_KEYS[segment]
  return key ? t(key) : segment
}

const Breadcrumbs = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const { t } = useI18n()

  if (segments.length === 0) return null

  return (
    <nav aria-label="breadcrumbs">
      <ul className="breadcrumbs">
        <li className="breadcrumbs-item">
          <Link to="/" className="breadcrumbs-link">
            {t('breadcrumb.home')}
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const label = getLabel(segment, segments[index - 1], t)

          return (
            <li key={href} className="breadcrumbs-item">
              <span className="breadcrumbs-sep">/</span>
              {isLast ? (
                <span className="breadcrumbs-current">{label}</span>
              ) : (
                <Link to={href} className="breadcrumbs-link">
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Breadcrumbs
