type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
  className?: string;
};

export default function BtnText({
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
      className={`text-blue cursor-pointer text-sm font-semibold transition-colors hover:text-[#1D89FF] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
