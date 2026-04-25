'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faQrcode, faPenToSquare, faGear, faRightFromBracket } from '@/lib/icons';

type NavItem = {
  label: string;
  href: string;
  icon: IconDefinition;
};

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'LEADS PLATFORM',
    items: [
      { label: 'Leads', href: '/lead-capture', icon: faUsers },
      { label: 'Scan QR', href: '/lead-capture/scan', icon: faQrcode },
      { label: 'Manual entry', href: '/lead-capture/manual', icon: faPenToSquare },
    ],
  },
  {
    title: 'CONFIGURATION',
    items: [{ label: 'Settings', href: '/lead-capture/settings', icon: faGear }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-80 flex-col rounded-lg bg-white/80 shadow-md lg:flex">
      {/* Brand */}
      <div className="flex flex-col gap-2 px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-white">
            CL
          </div>
          <div>
            <p className="text-sm font-bold">CINDE</p>
            <p className="text-blue-light text-xs font-semibold tracking-wide">LEAD CAPTURE</p>
          </div>
        </div>
      </div>

      <div className="mx-4 border-b border-black/10" />

      {/* Sections */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <p className="mb-2 px-2 text-xs text-gray-500">{section.title}</p>
            {section.items.map((item) => {
              const isActive =
                item.href === '/lead-capture'
                  ? pathname === '/lead-capture'
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-blue bg-white shadow-md'
                      : 'text-gray-700 hover:bg-white/50 hover:shadow'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer user */}
      <div className="m-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <div className="bg-blue flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white">
          MF
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">María Fernández</p>
          <p className="truncate text-xs text-gray-500">Investment Director</p>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          className="cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </aside>
  );
}
