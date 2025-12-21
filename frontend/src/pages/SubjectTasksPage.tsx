import { Link, useParams } from 'react-router-dom'

import { useTasks } from '../api/hooks'
import Badge from '../components/Badge'
import Card from '../components/Card'

const SubjectTasksPage = () => {
  const { subjectId } = useParams()
  const { data, isLoading, error } = useTasks(subjectId, true)

  return (
    <div className="grid">
      <Card
        title="Tasks"
        subtitle="Browse labs in this subject"
        action={<span className="pill">// simple helper text: pick one to upload</span>}
      >
        {isLoading && <p className="muted">Loading tasks...</p>}
        {error && <p className="error-text">{error.message || 'Failed to load tasks'}</p>}
        <div className="card-grid">
          {data?.map((task) => (
            <div key={task.id} className="glass mini-card">
              <div className="mini-card-top">
                <Badge tone={task.status === 'Success' ? 'success' : 'warning'} label={task.status || 'open'} />
                <Badge tone="info" label={`#${task.id}`} />
              </div>
              <h4>{task.name}</h4>
              <p className="muted">{task.description || 'Ready for your solution.'}</p>
              <Link className="btn btn-ghost" to={`/tasks/${task.id}`}>
                Open task
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SubjectTasksPage
