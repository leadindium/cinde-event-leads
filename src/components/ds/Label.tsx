import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type LabelColor =
  | 'green'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'blue'
  | 'black'
  | 'purple'
  | 'orange';

const colorStyles: Record<LabelColor, { bg: string; border: string; text: string }> = {
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  black: { bg: 'bg-black', border: 'border-black', text: 'text-white' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
};

type Props = {
  status: string;
  color?: LabelColor;
  icon?: IconDefinition;
};

export default function Label({ status, color = 'gray', icon }: Props) {
  const styles = colorStyles[color];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${styles.bg} ${styles.border} ${styles.text}`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-1.5" />}
      {status}
    </span>
  );
}
