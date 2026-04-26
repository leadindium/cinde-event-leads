'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLeadStore } from '@/features/leads/store';
import { STATUS_LABELS, STATUS_COLORS, type LeadStatus } from '@/features/leads/types';
import Label from '@/components/ds/Label';
import BtnIcon from '@/components/ds/BtnIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '@/components/ds/Pagination';
import BtnDropdown from '@/components/ds/BtnDropdown';
import StarRating from './StarRating';
import Avatar from './Avatar';
import { relativeTime } from '@/lib/helpers';
import { faMagnifyingGlass, faEye, faPaperPlane } from '@/lib/icons';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: STATUS_LABELS.new },
  { value: 'contacted', label: STATUS_LABELS.contacted },
  { value: 'qualified', label: STATUS_LABELS.qualified },
  { value: 'not_interested', label: STATUS_LABELS.not_interested },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'name', label: 'Name A→Z' },
];

const PAGE_SIZE = 10;

export default function LeadsTable() {
  const router = useRouter();
  const leads = useLeadStore((s) => s.leads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'name'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') result = result.filter((l) => l.status === statusFilter);
    switch (sortBy) {
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...result].sort((a, b) => a.fullName.localeCompare(b.fullName));
      default:
        return [...result].sort(
          (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
        );
    }
  }, [leads, search, statusFilter, sortBy]);

  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar — filtros izq, búsqueda der (en mobile: stacked, search full width) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BtnDropdown
            options={STATUS_FILTER_OPTIONS}
            selectedValue={statusFilter}
            onSelect={(v) => {
              setStatusFilter(v as LeadStatus | 'all');
              setCurrentPage(1);
            }}
            placeholder="All statuses"
          />
          <BtnDropdown
            options={SORT_OPTIONS}
            selectedValue={sortBy}
            onSelect={(v) => setSortBy(v as 'newest' | 'rating' | 'name')}
          />
        </div>
        <div className="relative w-full sm:w-80">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search name, company, email..."
            className="focus:border-blue focus:ring-blue/20 h-10 w-full rounded-full border border-gray-200 bg-white pr-4 pl-10 shadow-sm placeholder:italic placeholder:text-gray-400 focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Captured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                  No leads match your search.
                </td>
              </tr>
            ) : (
              paged.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/lead-capture/leads/${lead.id}`)}
                  className="cursor-pointer hover:bg-gray-50/80"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={lead.fullName} />
                      <div>
                        <p className="text-sm font-semibold">{lead.fullName}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm font-semibold">{lead.company}</p>
                    <p className="text-xs text-gray-500">{lead.jobTitle}</p>
                  </td>
                  <td>
                    <StarRating rating={lead.rating} size="sm" />
                  </td>
                  <td>
                    <Label status={STATUS_LABELS[lead.status]} color={STATUS_COLORS[lead.status]} />
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.slice(0, 2).map((tag) => (
                        <Label key={tag} status={tag} color="blue" />
                      ))}
                      {lead.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{lead.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-gray-500">{relativeTime(lead.capturedAt)}</p>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <BtnIcon
                        icon={faEye}
                        title="View"
                        onClick={() => router.push(`/lead-capture/leads/${lead.id}`)}
                      />
                      <BtnIcon
                        icon={faPaperPlane}
                        title="Send doc"
                        onClick={() => router.push(`/lead-capture/leads/${lead.id}#documents`)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="flex flex-col divide-y divide-gray-200 md:hidden">
        {paged.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No leads match your search.</p>
        )}
        {paged.map((lead) => (
          <button
            key={lead.id}
            onClick={() => router.push(`/lead-capture/leads/${lead.id}`)}
            className="flex w-full items-start gap-3 py-3 text-left hover:bg-gray-50/80"
          >
            <Avatar name={lead.fullName} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{lead.fullName}</p>
                <Label status={STATUS_LABELS[lead.status]} color={STATUS_COLORS[lead.status]} />
              </div>
              <p className="truncate text-xs text-gray-500">
                {lead.jobTitle} · {lead.company}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <StarRating rating={lead.rating} size="sm" />
                <span className="text-[11px] text-gray-500">{relativeTime(lead.capturedAt)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
        </p>
        <Pagination
          total={filtered.length}
          limit={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
