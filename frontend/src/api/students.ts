import type { PaginatedStudents, Student, StudentInput } from '../types/student'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/api/students'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers)
  if (options?.body) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      if (body?.message) message = body.message
    } catch {
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export interface FetchStudentsParams {
  page: number
  limit: number
  search?: string
  signal?: AbortSignal
}

export function fetchStudents({ page, limit, search, signal }: FetchStudentsParams) {
  const query = new URLSearchParams()
  query.set('page', String(page))
  query.set('limit', String(limit))
  if (search) query.set('search', search)
  return request<PaginatedStudents>(`${API_BASE}?${query.toString()}`, { signal })
}

export function createStudent(input: StudentInput) {
  return request<Student>(API_BASE, {
    method: 'POST',
    body: JSON.stringify(input)
  })
}

export function updateStudent(id: string, input: StudentInput) {
  return request<Student>(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  })
}

export function deleteStudent(id: string) {
  return request<{ message: string }>(`${API_BASE}/${id}`, {
    method: 'DELETE'
  })
}