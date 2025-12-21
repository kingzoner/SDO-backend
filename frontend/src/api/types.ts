export type Role = 'student' | 'teacher' | 'admin' | 'unknown'

export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = {
  first_name: string
  last_name: string
  middle_name: string
  username: string
  password: string
  group_name: string
}

export type AuthResponse = {
  access_token: string
  role?: Role
}

export type Subject = {
  id: number
  name: string
  grade?: number
  status?: string
}

export type TaskSummary = {
  id: number
  name: string
  description?: string
  status?: string
}

export type Solution = {
  id: number
  code: string
  status: string
  is_hidden: boolean
}

export type TaskDetail = {
  id: number
  name: string
  description?: string
  count_subtasks: number
  status: string
  solutions: Solution[]
}

export type TestResult = {
  status: string
  formulas_output?: string
  code_output?: string
  execution_time?: number
  code_length?: number
}

export type UserStatus = {
  status: Role
}

export type Group = {
  id: number
  name: string
}

export type TeacherSubject = {
  id: number
  title?: string
  name?: string
  status?: string
}
