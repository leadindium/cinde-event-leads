import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLeadStore } from '../store/useLeadStore';
import StarRating from './StarRating';
import { showToast } from './Toast';

export default function ManualEntryForm() {
  const navigate = useNavigate();
  const addLead = useLeadStore((s) => s.addLead);
  const customTags = useLeadStore((s) => s.config.customTags);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    country: '',
    notes: '',
    rating: 0,
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string | number | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newLead = addLead({
      attendeeId: '',
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      jobTitle: form.jobTitle.trim(),
      country: form.country.trim(),
      notes: form.notes.trim(),
      rating: form.rating,
      tags: form.tags,
      capturedBy: 'Current User',
    });

    showToast('Lead saved!');
    navigate(`/lead-capture/leads/${newLead.id}`);
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 text-sm rounded-lg border ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-border focus:ring-primary/20 focus:border-primary'
    } bg-white focus:outline-none focus:ring-2`;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-white sticky top-0 z-10">
        <button onClick={() => navigate('/lead-capture')} className="text-text-light hover:text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-text-primary">Manual Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
        <div className="bg-white rounded-lg border border-border p-4 lg:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Full Name *</label>
            <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputClass('fullName')} placeholder="e.g. María Fernández" />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass('email')} placeholder="email@company.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass('phone')} placeholder="+506 8000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Country</label>
              <input type="text" value={form.country} onChange={(e) => update('country', e.target.value)} className={inputClass('country')} placeholder="Costa Rica" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Company</label>
              <input type="text" value={form.company} onChange={(e) => update('company', e.target.value)} className={inputClass('company')} placeholder="Company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Job Title</label>
              <input type="text" value={form.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} className={inputClass('jobTitle')} placeholder="VP Operations" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className={`${inputClass('notes')} resize-y min-h-[80px]`} placeholder="Add notes about this conversation..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Rating</label>
            <StarRating rating={form.rating} onChange={(r) => update('rating', r)} size={24} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {customTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    form.tags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-bg text-text-light hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Save Lead
        </button>
      </form>
    </div>
  );
}
