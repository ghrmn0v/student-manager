export interface Student {
  id: string
  first_name: string
  last_name: string
  major: string
  email: string
  gpa: number
  created_at: string
}

export type StudentInput = Omit<Student, 'id' | 'created_at'>

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedStudents {
  data: Student[]
  meta: PaginationMeta
}