import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import Button from './Button'

const Navbar = () => {
  const { token, role, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => (location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link')

  return (
    <header className="navbar glass">
      <Link to="/" className="brand">
        <span className="brand-dot" />
        SDO
      </Link>
      <nav className="nav-links">
        {token && (
          <>
            <Link className={isActive('/subjects')} to="/subjects">
              Subjects
            </Link>
            {role === 'teacher' && (
              <Link className={isActive('/teacher')} to="/teacher">
                Teacher
              </Link>
            )}
          </>
        )}
      </nav>
      <div className="nav-actions">
        {role && <span className="role-pill">{role}</span>}
        {token ? (
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Link className="nav-link" to="/login">
            Login
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
