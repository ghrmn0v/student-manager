import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Student, StudentInput } from '../types/student'
import { useLanguage } from '../contexts/LanguageContext'

interface StudentModalProps {
  student: Student | null
  onSubmit: (input: StudentInput) => Promise<void>
  onClose: () => void
  submitting: boolean
}

interface FieldErrors {
  first_name?: string
  last_name?: string
  major?: string
  email?: string
  gpa?: string
}

export function StudentModal({ student, onSubmit, onClose, submitting }: StudentModalProps) {
  const { t } = useLanguage()
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [major, setMajor] = useState('')
  const [email, setEmail] = useState('')
  const [gpa, setGpa] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  const firstInputRef = useRef<HTMLInputElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    firstInputRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (student) {
      setFirstName(student.first_name)
      setLastName(student.last_name)
      setMajor(student.major)
      setEmail(student.email)
      setGpa(String(student.gpa))
    }
  }, [student])

  function validate(): FieldErrors {
    const next: FieldErrors = {}

    if (!first_name.trim()) next.first_name = t('validation.required')
    if (!last_name.trim()) next.last_name = t('validation.required')
    if (!major.trim()) next.major = t('validation.required')

    if (!email.trim()) {
      next.email = t('validation.required')
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = t('validation.invalidEmail')
    }

    const gpaNumber = Number(gpa)
    if (gpa.trim() === '') {
      next.gpa = t('validation.required')
    } else if (Number.isNaN(gpaNumber)) {
      next.gpa = t('validation.gpaNumber')
    } else if (gpaNumber < 0 || gpaNumber > 4) {
      next.gpa = t('validation.gpaRange')
    }

    return next
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    await onSubmit({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      major: major.trim(),
      email: email.trim(),
      gpa: Number(gpa)
    })
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 id="student-modal-title">{student ? t('editStudent') : t('addStudent')}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            {t('firstName')} *
            <input
              ref={firstInputRef}
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.first_name && <span className="field-error">{errors.first_name}</span>}
          </label>
          <label>
            {t('lastName')} *
            <input value={last_name} onChange={(e) => setLastName(e.target.value)} />
            {errors.last_name && <span className="field-error">{errors.last_name}</span>}
          </label>
          <label>
            {t('major')} *
            <input value={major} onChange={(e) => setMajor(e.target.value)} />
            {errors.major && <span className="field-error">{errors.major}</span>}
          </label>
          <label>
            {t('email')} *
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            {t('gpaLabel')} *
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="0.0 - 4.0"
            />
            {errors.gpa && <span className="field-error">{errors.gpa}</span>}
          </label>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}