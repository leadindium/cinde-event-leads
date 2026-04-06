import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, QrCode } from 'lucide-react';
import { useLeadStore } from '../store/useLeadStore';
import StarRating from './StarRating';
import { relativeTime, STATUS_COLORS, STATUS_LABELS, getInitials, getAvatarColor } from '../utils/helpers';
import type { LeadStatus } from '../types';

type SortKey = 'newest' | 'rating' | 'name';

export default function LeadsTable() {
  const leads = useLeadStore((s) => s.leads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }
    switch (sortBy) {
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
    }
    return result;
  }, [leads, search, statusFilter, sortBy]);

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <QrCode size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">No leads captured yet</h3>
        <p className="text-text-light text-sm">Scan your first QR code to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      {/* Search & Filters */}
      <div className="p-3 border-b border-border">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters ? 'bg-primary text-white border-primary' : 'border-border text-text-light hover:bg-bg'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-text-light mr-2">Filter:</div>
            {(['all', 'new', 'contacted', 'qualified', 'not_interested'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-primary text-white'
                    : 'bg-bg text-text-light hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : STATUS_LABELS[s]}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-xs text-text-light">
              Sort:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="text-xs border border-border rounded px-2 py-1 bg-white"
              >
                <option value="newest">Newest</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-light uppercase tracking-wider">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Captured</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => navigate(`/lead-capture/leads/${lead.id}`)}
                className="border-b border-border last:border-0 hover:bg-bg cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                      style={{ backgroundColor: getAvatarColor(lead.fullName) }}
                    >
                      {getInitials(lead.fullName)}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{lead.fullName}</p>
                      <p className="text-xs text-text-light">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-light">{lead.company}</td>
                <td className="px-4 py-3">
                  <StarRating rating={lead.rating} size={14} />
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                    {lead.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-text-light">
                        +{lead.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-light text-xs">{relativeTime(lead.capturedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-border">
        {filtered.map((lead) => (
          <div
            key={lead.id}
            onClick={() => navigate(`/lead-capture/leads/${lead.id}`)}
            className="p-3 hover:bg-bg cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                style={{ backgroundColor: getAvatarColor(lead.fullName) }}
              >
                {getInitials(lead.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text-primary truncate">{lead.fullName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ml-2 ${STATUS_COLORS[lead.status]}`}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
                <p className="text-xs text-text-light">{lead.jobTitle} @ {lead.company}</p>
                <div className="flex items-center justify-between mt-1">
                  <StarRating rating={lead.rating} size={12} />
                  <span className="text-[10px] text-text-light">{relativeTime(lead.capturedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-text-light text-sm">
          No leads match your search
        </div>
      )}

      <div className="px-4 py-2 border-t border-border text-xs text-text-light">
        {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
