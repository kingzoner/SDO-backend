import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useLogin } from '../api/hooks'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/error'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const loginMutation = useLogin()

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    loginMutation.mutate(form, {
      onSuccess: (data) => {
        setAuth(data.access_token, data.role ?? null)
        navigate('/subjects')
      },
    })
  }

  return (
    <div className="auth-grid">
      <Card
        title="Welcome back"
        subtitle="Glass-blue workspace for labs and submissions"
        action={<span className="pill">// simple helper text: try student / student</span>}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <Input
            label="Username"
            placeholder="student"
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </Button>
          {loginMutation.isError && (
            <p className="error-text">{getErrorMessage(loginMutation.error)}</p>
          )}
        </form>
        <p className="muted">
          No account yet? <Link to="/register">Register</Link>
        </p>
      </Card>

      <Card title="SDO highlights" subtitle="Purple-blue glass theme">
        <ul className="list">
          <li>Upload & test solutions with instant feedback.</li>
          <li>Tasks grouped by subjects; clean teacher dashboards.</li>
          <li>Protected routes, JWT auth, CORS-safe backend.</li>
          <li>// simple helper text: keep the token safe.</li>
        </ul>
      </Card>
    </div>
  )
}

export default LoginPage
