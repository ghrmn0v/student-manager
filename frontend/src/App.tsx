import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  updateStudent
} from './api/students'
import type { Student, StudentInput } from './types/student'
import { useLanguage } from './contexts/LanguageContext'
import { useToast } from './contexts/ToastContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { SearchBar } from './components/SearchBar'
import { StudentTable } from './components/StudentTable'
import { StudentModal } from './components/StudentModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Pagination } from './components/Pagination'
import { Spinner } from './components/Spinner'

const PAGE_SIZE = 10

export default function App() {
  const { t } = useLanguage()
  const { showToast } = useToast()

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const result = await fetchStudents({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        signal: controller.signal
      })
      if (result.meta.totalPages > 0 && page > result.meta.totalPages) {
        setPage(result.meta.totalPages)
        return
      }
      setStudents(result.data)
      setTotalPages(result.meta.totalPages)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      showToast(error instanceof Error ? error.message : t('toast.error'), 'error')
    } finally {
      if (controller === abortRef.current) {
        setLoading(false)
      }
    }
  }, [page, debouncedSearch, showToast, t])

  useEffect(() => {
    load()
    return () => abortRef.current?.abort()
  }, [load])

  async function handleSubmit(input: StudentInput) {
    setSubmitting(true)
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, input)
        showToast(t('toast.updated'))
      } else {
        await createStudent(input)
        showToast(t('toast.added'))
      }
      setModalOpen(false)
      setEditingStudent(null)
      load()
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('toast.error'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteStudent(deleteTarget.id)
      showToast(t('toast.deleted'))
      setDeleteTarget(null)
      load()
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('toast.error'), 'error')
    }
  }

  function openAddModal() {
    setEditingStudent(null)
    setModalOpen(true)
  }

  function openEditModal(student: Student) {
    setEditingStudent(student)
    setModalOpen(true)
  }

  const closeModal = useCallback(() => setModalOpen(false), [])
  const clearDeleteTarget = useCallback(() => setDeleteTarget(null), [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('appTitle')}</h1>
        <LanguageSwitcher />
      </header>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder={t('searchPlaceholder')} />
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          {t('addStudent')}
        </button>
      </div>

      {loading ? (
        <div className="loading-box">
          <Spinner />
          {t('loading')}
        </div>
      ) : (
        <>
          <StudentTable
            students={students}
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {modalOpen && (
        <StudentModal
          student={editingStudent}
          onSubmit={handleSubmit}
          onClose={closeModal}
          submitting={submitting}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t('confirmDelete.title')}
          message={`${deleteTarget.first_name} ${deleteTarget.last_name} — ${t('confirmDelete.message')}`}
          confirmLabel={t('confirmDelete.confirm')}
          cancelLabel={t('confirmDelete.cancel')}
          onConfirm={handleDelete}
          onCancel={clearDeleteTarget}
        />
      )}
    </div>
  )
}