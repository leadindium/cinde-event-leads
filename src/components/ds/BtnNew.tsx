'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@/lib/icons';

type Props = {
  onClick: () => void;
  title?: string;
};

export default function BtnNew({ onClick, title = 'New' }: Props) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-md transition-all duration-300 hover:shadow-lg"
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}
