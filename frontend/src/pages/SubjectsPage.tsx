import { Link } from 'react-router-dom'

import { useSubjects } from '../api/hooks'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'

const SubjectsPage = () => {
  const { token } = useAuth()
  const { data, isLoading, error } = useSubjects(Boolean(token))

  return (
    <div className="grid">
      <Card title="Your subjects" subtitle="Pick a subject to see its tasks">
        {isLoading && <p className="muted">Loading subjects...</p>}
        {error && <p className="error-text">{error.message || 'Failed to load subjects'}</p>}
        <div className="card-grid">
          {data?.map((subject) => (
            <Link key={subject.id} to={`/subjects/${subject.id}/tasks`} className="glass mini-card">
              <div className="mini-card-top">
                <Badge tone="info" label={`id ${subject.id}`} />
                <Badge tone={subject.status === 'Success' ? 'success' : 'warning'} label={subject.status || 'open'} />
              </div>
              <h4>{subject.name}</h4>
              <p className="muted">// simple helper text: click to view labs</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SubjectsPage
