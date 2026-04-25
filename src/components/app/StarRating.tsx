'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@/lib/icons';

type Props = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-2xl',
};

export default function StarRating({ rating, onChange, size = 'md' }: Props) {
  const interactive = !!onChange;

  // Read-only: span (puede vivir dentro de <button> de un row clickeable).
  if (!interactive) {
    return (
      <span
        className="inline-flex items-center gap-1"
        role="img"
        aria-label={`${rating} of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${sizeMap[size]} ${star <= rating ? 'text-amber-500' : 'text-gray-300'}`}
          >
            <FontAwesomeIcon icon={faStar} />
          </span>
        ))}
      </span>
    );
  }

  // Interactive: buttons individuales por estrella.
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star === rating ? 0 : star)}
            aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
            className={`${sizeMap[size]} cursor-pointer transition-transform duration-150 hover:scale-110 ${
              filled ? 'text-amber-500' : 'text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
        );
      })}
    </div>
  );
}
