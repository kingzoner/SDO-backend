import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from './client'
import type {
  AuthResponse,
  Group,
  LoginPayload,
  RegisterPayload,
  Subject,
  TaskDetail,
  TaskSummary,
  TestResult,
  UserStatus,
  TeacherSubject,
} from './types'

export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<AuthResponse>('/login', payload)
      return data
    },
  })

export const useRegister = () =>
  useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<AuthResponse>('/register', payload)
      return data
    },
  })

export const useUserStatus = (enabled: boolean) =>
  useQuery<UserStatus>({
    queryKey: ['user-status'],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<UserStatus>('/user_status')
      return data
    },
  })

export const useSubjects = (enabled: boolean) =>
  useQuery<Subject[]>({
    queryKey: ['subjects'],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<Subject[]>('/subjects')
      return data
    },
  })

export const useTasks = (subjectId?: string, enabled?: boolean) =>
  useQuery<TaskSummary[]>({
    queryKey: ['tasks', subjectId],
    enabled: Boolean(subjectId) && Boolean(enabled),
    queryFn: async () => {
      const { data } = await api.get<TaskSummary[]>(`/tasks/${subjectId}`)
      return data
    },
  })

export const useTaskDetail = (taskId?: string) =>
  useQuery<TaskDetail>({
    queryKey: ['task', taskId],
    enabled: Boolean(taskId),
    queryFn: async () => {
      const { data } = await api.get<TaskDetail>(`/task/${taskId}`)
      return data
    },
  })

export const useUploadSolution = () => {
  const queryClient = useQueryClient()
  return useMutation<
    unknown,
    Error,
    { taskId: string; file: File },
    { previous?: TaskDetail }
  >({
    mutationFn: async ({ taskId, file }) => {
      const body = new FormData()
      body.append('file', file)
      const { data } = await api.post(`/upload/${taskId}`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
    },
  })
}

export const useTestSolution = () =>
  useMutation<TestResult, Error, { taskId: string }>({
    mutationFn: async ({ taskId }) => {
      // Accept 4xx so we can surface the error payload instead of throwing
      const { data } = await api.post<TestResult>(`/test/${taskId}`, undefined, {
        validateStatus: (status) => status < 500,
      })
      return data
    },
  })

export const useTeacherGroups = (enabled?: boolean) =>
  useQuery<Group[]>({
    queryKey: ['teacher-groups'],
    enabled: Boolean(enabled),
    queryFn: async () => {
      const { data } = await api.get<Group[]>('/api/teachers/groups')
      return data
    },
  })

export const useTeacherSubjects = (enabled?: boolean) =>
  useQuery<TeacherSubject[]>({
    queryKey: ['teacher-subjects'],
    enabled: Boolean(enabled),
    queryFn: async () => {
      const { data } = await api.get<TeacherSubject[]>('/api/teachers/subjects')
      return data
    },
  })
