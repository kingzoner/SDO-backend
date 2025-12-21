import Card from '../components/Card'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { useTeacherGroups, useTeacherSubjects } from '../api/hooks'

const TeacherDashboard = () => {
  const { role } = useAuth()
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useTeacherGroups(role === 'teacher')
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useTeacherSubjects(role === 'teacher')

  return (
    <div className="grid">
      <Card title="Teacher space" subtitle="Groups and subjects you handle">
        {role !== 'teacher' && <p className="muted">You need a teacher role to see controls.</p>}
        <div className="split">
          <div className="glass input-panel">
            <div className="mini-card-top">
              <h4>Groups</h4>
              <span className="pill">// simple helper text: read-only list</span>
            </div>
            {groupsLoading && <p className="muted">Loading groups...</p>}
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
              <h4>Subjects</h4>
              <span className="pill">labs under your supervision</span>
            </div>
            {subjectsLoading && <p className="muted">Loading subjects...</p>}
            {subjectsError && <p className="error-text">{subjectsError.message}</p>}
            <div className="stack">
              {subjects?.map((subject) => (
                <div key={subject.id} className="mini-card glass">
                  <div className="mini-card-top">
                    <Badge tone="info" label={`#${subject.id}`} />
                    <Badge tone="success" label={subject.status || 'active'} />
                  </div>
                  <h4>{subject.title || subject.name || 'Subject'}</h4>
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
