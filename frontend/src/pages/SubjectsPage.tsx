import { Link } from 'react-router-dom'

import { useSubjects } from '../api/hooks'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

const SubjectsPage = () => {
  const { token } = useAuth()
  const { data, isLoading, error } = useSubjects(Boolean(token))
  const { t } = useI18n()

  return (
    <div className="grid">
      <Card title={t('subjects.title')} subtitle={t('subjects.subtitle')}>
        {isLoading && <p className="muted">{t('subjects.loading')}</p>}
        {error && <p className="error-text">{error.message || t('subjects.error')}</p>}
        <div className="card-grid">
          {data?.map((subject) => (
            <Link key={subject.id} to={`/subjects/${subject.id}/tasks`} className="glass mini-card">
              <div className="mini-card-top">
                <Badge tone="info" label={`id ${subject.id}`} />
                <Badge
                  tone={subject.status === 'Success' ? 'success' : 'warning'}
                  label={subject.status || t('subjects.statusOpen')}
                />
              </div>
              <h4>{subject.name}</h4>
              <p className="muted">{t('subjects.cardHint')}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SubjectsPage
