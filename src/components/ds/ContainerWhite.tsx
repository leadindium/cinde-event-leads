type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ContainerWhite({ children, className = '' }: Props) {
  return (
    <div
      className={`relative flex-1 overflow-y-auto rounded-2xl bg-white/80 shadow-md ${className}`}
    >
      {children}
      <div className="sticky bottom-0 left-0 z-10 h-6 w-full bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
