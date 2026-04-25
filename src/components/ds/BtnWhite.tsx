type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
  className?: string;
};

export default function BtnWhite({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:shadow disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
