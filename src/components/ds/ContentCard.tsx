import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowUp } from '@/lib/icons';

type Props = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: IconDefinition;
  iconColor?: string;
  iconBgColor?: string;
};

export default function ContentCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon = faStar,
  iconColor = 'text-blue',
  iconBgColor = 'bg-blue-100',
}: Props) {
  const changeColor =
    changeType === 'positive'
      ? 'text-green-500'
      : changeType === 'negative'
        ? 'text-red-500'
        : 'text-gray-400';

  return (
    <div className="h-full w-full min-w-[330px] rounded-2xl border border-[#E9EAEB] bg-white px-4 py-6">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
          <FontAwesomeIcon icon={icon} className={`text-xl ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="mb-2 text-sm text-gray-600">{title}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-[#E9EAEB] px-1.5 py-0.5">
                <FontAwesomeIcon icon={faArrowUp} className={`rotate-45 text-xs ${changeColor}`} />
                <span className="text-sm text-gray-700">{change}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
