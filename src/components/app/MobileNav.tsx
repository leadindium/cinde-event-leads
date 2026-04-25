'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faQrcode, faPenToSquare, faGear } from '@/lib/icons';

const ITEMS: { href: string; icon: IconDefinition; label: string }[] = [
  { href: '/lead-capture', icon: faUsers, label: 'Leads' },
  { href: '/lead-capture/scan', icon: faQrcode, label: 'Scan' },
  { href: '/lead-capture/manual', icon: faPenToSquare, label: 'Manual' },
  { href: '/lead-capture/settings', icon: faGear, label: 'Settings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-gray-200 bg-white shadow-lg lg:hidden">
      {ITEMS.map((item) => {
        const isActive =
          item.href === '/lead-capture'
            ? pathname === '/lead-capture'
            : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-blue' : 'text-gray-500'
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className="text-base" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
