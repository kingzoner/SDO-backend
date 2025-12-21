import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useRegister } from '../api/hooks'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/error'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const registerMutation = useRegister()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    middle_name: '-',
    username: '',
    password: '',
    group_name: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    registerMutation.mutate(form, {
      onSuccess: (data) => {
        setAuth(data.access_token, data.role ?? null)
        navigate('/subjects')
      },
    })
  }

  return (
    <div className="auth-grid">
      <Card
        title="Create account"
        subtitle="Enroll and start solving labs"
        action={<span className="pill">// simple helper text: group name must exist</span>}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <Input
            label="First name"
            placeholder="John"
            value={form.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            required
          />
          <Input
            label="Last name"
            placeholder="Doe"
            value={form.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            required
          />
          <Input
            label="Middle name"
            placeholder="-"
            value={form.middle_name}
            onChange={(e) => handleChange('middle_name', e.target.value)}
          />
          <Input
            label="Username"
            placeholder="your handle"
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
          <Input
            label="Group"
            placeholder="211-365"
            value={form.group_name}
            onChange={(e) => handleChange('group_name', e.target.value)}
            required
            hint="Use an existing group name"
          />
          <Button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Creating...' : 'Register'}
          </Button>
          {registerMutation.isError && (
            <p className="error-text">{getErrorMessage(registerMutation.error)}</p>
          )}
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  )
}

export default RegisterPage
