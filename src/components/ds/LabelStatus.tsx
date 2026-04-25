type LabelStatusColor = 'green' | 'gray' | 'red' | 'yellow';

const dotStyles: Record<LabelStatusColor, string> = {
  green: 'bg-green-500',
  gray: 'bg-gray-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
};

type Props = {
  status: string;
  color: LabelStatusColor;
};

export default function LabelStatus({ status, color }: Props) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-1 text-xs shadow-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[color]}`} />
      {status}
    </span>
  );
}
