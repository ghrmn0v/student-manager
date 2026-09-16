import { useLanguage } from '../contexts/LanguageContext'
import type { TranslationKey } from '../translations'
import type { Student } from '../types/student'

interface StudentTableProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
}

function formatDate(value: string, t: (key: TranslationKey) => string): string {
  const date = new Date(value)
  const day = date.getDate()
  const month = t(`date.month${date.getMonth() + 1}` as TranslationKey)
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  const { t } = useLanguage()

  if (students.length === 0) {
    return <div className="empty-state">{t('noStudents')}</div>
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>{t('firstName')}</th>
            <th>{t('lastName')}</th>
            <th>{t('major')}</th>
            <th>{t('email')}</th>
            <th>{t('gpaLabel')}</th>
            <th>{t('createdAt')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.major}</td>
              <td>{student.email}</td>
              <td>{Number(student.gpa).toFixed(2)}</td>
              <td>{formatDate(student.created_at, t)}</td>
              <td>
                <div className="row-actions">
                  <button type="button" className="btn btn-edit" onClick={() => onEdit(student)}>
                    {t('edit')}
                  </button>
                  <button type="button" className="btn btn-delete" onClick={() => onDelete(student)}>
                    {t('delete')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}