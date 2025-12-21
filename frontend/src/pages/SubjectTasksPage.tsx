import { Link, useParams } from 'react-router-dom'

import { useTasks } from '../api/hooks'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { useI18n } from '../i18n/I18nContext'

const SubjectTasksPage = () => {
  const { subjectId } = useParams()
  const { data, isLoading, error } = useTasks(subjectId, true)
  const { t } = useI18n()

  return (
    <div className="grid">
      <Card
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        action={<span className="pill">{t('tasks.hint')}</span>}
      >
        {isLoading && <p className="muted">{t('tasks.loading')}</p>}
        {error && <p className="error-text">{error.message || t('tasks.error')}</p>}
        <div className="card-grid">
          {data?.map((task) => (
            <div key={task.id} className="glass mini-card">
              <div className="mini-card-top">
                <Badge
                  tone={task.status === 'Success' ? 'success' : 'warning'}
                  label={task.status || t('subjects.statusOpen')}
                />
                <Badge tone="info" label={`#${task.id}`} />
              </div>
              <h4>{task.name}</h4>
              <p className="muted">{task.description || t('tasks.ready')}</p>
              <Link className="btn btn-ghost" to={`/tasks/${task.id}`}>
                {t('tasks.openTask')}
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SubjectTasksPage
