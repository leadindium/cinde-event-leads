'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faFloppyDisk } from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import { useToast } from '@/components/ds/ToastProvider';
import BtnBlue from '@/components/ds/BtnBlue';
import StarRating from './StarRating';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional().default(''),
  company: z.string().optional().default(''),
  jobTitle: z.string().optional().default(''),
  country: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

type FormValues = z.infer<typeof schema>;

export default function ManualEntryForm() {
  const router = useRouter();
  const addLead = useLeadStore((s) => s.addLead);
  const customTags = useLeadStore((s) => s.config.customTags);
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    const newLead = addLead({
      attendeeId: '',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      jobTitle: data.jobTitle,
      country: data.country,
      notes: data.notes,
      rating,
      tags,
      capturedBy: 'María Fernández',
    });
    showToast({ title: 'Lead saved', variant: 'success' });
    router.push(`/lead-capture/leads/${newLead.id}`);
  };

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/lead-capture')}
          aria-label="Back"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <h1 className="text-2xl font-bold">Manual entry</h1>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <Field
          label="Full name *"
          help="As it appears on their badge."
          error={errors.fullName?.message}
        >
          <input
            type="text"
            placeholder="e.g. María Fernández"
            className="input"
            {...register('fullName')}
          />
        </Field>

        <Field label="Email *" error={errors.email?.message}>
          <input
            type="email"
            placeholder="email@company.com"
            className="input"
            {...register('email')}
          />
        </Field>

        <Field label="Phone">
          <input type="tel" placeholder="+506 8000-0000" className="input" {...register('phone')} />
        </Field>

        <Field label="Country">
          <input type="text" placeholder="Costa Rica" className="input" {...register('country')} />
        </Field>

        <Field label="Company">
          <input
            type="text"
            placeholder="Company name"
            className="input"
            {...register('company')}
          />
        </Field>

        <Field label="Job title">
          <input
            type="text"
            placeholder="VP Operations"
            className="input"
            {...register('jobTitle')}
          />
        </Field>

        <Field label="Notes">
          <textarea
            rows={3}
            placeholder="Talked about expansion plans, regulatory questions..."
            className="input"
            {...register('notes')}
          />
        </Field>

        <div className="input-group">
          <div>
            <label>Rating</label>
            <p className="mt-1 text-xs text-gray-500">Quality of fit / interest level.</p>
          </div>
          <div>
            <StarRating rating={rating} onChange={setRating} size="lg" />
          </div>
        </div>

        <div className="input-group">
          <div>
            <label>Tags</label>
            <p className="mt-1 text-xs text-gray-500">Categorize this conversation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {customTags.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'border-blue bg-blue text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <BtnBlue type="submit" disabled={isSubmitting}>
          <span className="inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faFloppyDisk} />
            Save lead
          </span>
        </BtnBlue>
      </div>
    </form>
  );
}

function Field({
  label,
  help,
  error,
  children,
}: {
  label: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="input-group">
      <div>
        <label>{label}</label>
        {help && <p className="mt-1 text-xs text-gray-500">{help}</p>}
      </div>
      <div>
        {children}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
