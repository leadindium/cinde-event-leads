type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function BtnGray({ children, onClick, disabled = false }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-full bg-gray-200 px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-300"
    >
      {children}
    </button>
  );
}
