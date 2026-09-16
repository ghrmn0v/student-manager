import { useLanguage } from '../contexts/LanguageContext'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useLanguage()

  if (totalPages <= 1) return null

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end = Math.min(totalPages, start + 4)
  const visiblePages = allPages.slice(start - 1, end)

  return (
    <div className="pagination">
      <span className="page-info">
        {t('pagination.page')} {page} / {totalPages}
      </span>
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        {t('pagination.prev')}
      </button>
      {visiblePages.map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? 'active' : ''}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        {t('pagination.next')}
      </button>
    </div>
  )
}