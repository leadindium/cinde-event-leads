import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@/lib/icons';

type Props = {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ total, limit, currentPage, onPageChange }: Props) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const handle = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const generate = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage <= 4) {
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) pages.push(i);
      if (totalPages > 5) pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push('...');
      for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) pages.push(i);
    } else {
      pages.push('...');
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 rounded-4xl bg-white p-2 shadow-sm">
      <button
        type="button"
        onClick={() => handle(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          currentPage === 1
            ? 'cursor-not-allowed text-gray-300'
            : 'cursor-pointer text-gray-600 hover:bg-gray-100'
        }`}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
      </button>
      <div className="flex items-center gap-1">
        {generate().map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
              type="button"
              onClick={() => handle(page as number)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-[#EBF1FC] text-blue-600'
                  : 'cursor-pointer text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        onClick={() => handle(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-300'
            : 'cursor-pointer text-gray-600 hover:bg-gray-100'
        }`}
      >
        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
      </button>
    </div>
  );
}
