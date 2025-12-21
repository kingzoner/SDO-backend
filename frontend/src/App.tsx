import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

import { useUserStatus } from './api/hooks'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SubjectTasksPage from './pages/SubjectTasksPage'
import SubjectsPage from './pages/SubjectsPage'
import TaskDetailPage from './pages/TaskDetailPage'
import TeacherDashboard from './pages/TeacherDashboard'

const App = () => {
  const { token, setRole } = useAuth()
  const { data: userStatus } = useUserStatus(Boolean(token))

  useEffect(() => {
    if (userStatus?.status) {
      setRole(userStatus.status)
    }
  }, [userStatus, setRole])

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration" element={<RegisterPage />} />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:subjectId/tasks"
          element={
            <ProtectedRoute>
              <SubjectTasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
