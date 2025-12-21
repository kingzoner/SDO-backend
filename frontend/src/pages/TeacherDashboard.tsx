import Card from '../components/Card'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { useTeacherGroups, useTeacherSubjects } from '../api/hooks'
import { useI18n } from '../i18n/I18nContext'

const TeacherDashboard = () => {
  const { role } = useAuth()
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useTeacherGroups(role === 'teacher')
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useTeacherSubjects(role === 'teacher')
  const { t } = useI18n()

  return (
    <div className="grid">
      <Card title={t('teacher.title')} subtitle={t('teacher.subtitle')}>
        {role !== 'teacher' && <p className="muted">{t('teacher.needRole')}</p>}
        <div className="split">
          <div className="glass input-panel">
            <div className="mini-card-top">
              <h4>{t('teacher.groups')}</h4>
              <span className="pill">{t('teacher.readonlyHint')}</span>
            </div>
            {groupsLoading && <p className="muted">{t('teacher.loadingGroups')}</p>}
            {groupsError && <p className="error-text">{groupsError.message}</p>}
            <div className="stack">
              {groups?.map((group) => (
                <div key={group.id} className="mini-card glass">
                  <div className="mini-card-top">
                    <Badge tone="info" label={`#${group.id}`} />
                  </div>
                  <h4>{group.name}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="glass input-panel">
            <div className="mini-card-top">
              <h4>{t('teacher.subjects')}</h4>
              <span className="pill">{t('teacher.labsUnder')}</span>
            </div>
            {subjectsLoading && <p className="muted">{t('teacher.loadingSubjects')}</p>}
            {subjectsError && <p className="error-text">{subjectsError.message}</p>}
            <div className="stack">
              {subjects?.map((subject) => (
                <div key={subject.id} className="mini-card glass">
                  <div className="mini-card-top">
                    <Badge tone="info" label={`#${subject.id}`} />
                    <Badge tone="success" label={subject.status || t('status.active')} />
                  </div>
                  <h4>{subject.title || subject.name || t('teacher.subjectFallback')}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TeacherDashboard
