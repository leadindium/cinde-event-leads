'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@/lib/icons';

type Props = {
  onClick: () => void;
  type?: 'submit' | 'button';
  title?: string;
};

export default function BtnClose({ onClick, type = 'button', title = 'Close' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-sm shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <FontAwesomeIcon icon={faXmark} />
    </button>
  );
}
