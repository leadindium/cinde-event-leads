import { getAvatarColor, getInitials } from '@/lib/helpers';

type Props = {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

export default function Avatar({ name, size = 'md' }: Props) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeMap[size]}`}
      style={{ backgroundColor: getAvatarColor(name) }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
