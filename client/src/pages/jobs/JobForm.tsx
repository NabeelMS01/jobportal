import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '@/store/store';
import { createJob, updateJob } from '@/store/slices/jobSlice';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';

const jobSchema = z.object({
  title: z.string().min(3, 'Title is required and must be at least 3 characters'),
  description: z.string().min(10, 'Description is required and must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  experienceLevel: z.string().min(2, 'Experience level is required'),
  location: z.string().min(2, 'Location is required'),
  salary: z.string().optional(),
  company: z.string().min(2, 'Company name is required'),
});

type JobFormData = z.infer<typeof jobSchema>;

function Field({ label, children, full, error }: { label: string; children: React.ReactNode; full?: boolean; error?: string }) {
  return (
    <div className={cn(full && "md:col-span-2")}>
      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-[var(--destructive)]">{error}</p>}
    </div>
  );
}

const JobForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useHookForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    if (isEditing) {
      api.get(`/api/jobs/${id}`).then((res) => {
        reset(res.data);
      }).catch((err) => {
        console.error(err);
        navigate('/');
      });
    }
  }, [id, isEditing, reset, navigate]);

  const onSubmit = async (data: JobFormData) => {
    try {
      if (isEditing) {
        await dispatch(updateJob({ id: Number(id), data })).unwrap();
      } else {
        await dispatch(createJob(data)).unwrap();
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save job', error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in mx-auto">
      <div>
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight">{isEditing ? "Edit Job Posting" : "Create New Job Posting"}</h2>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below to publish the role.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl shadow-soft p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Job Title" full error={errors.title?.message}>
            <Input {...register('title')} placeholder="e.g. Senior Frontend Engineer" />
          </Field>
          
          <Field label="Company Name" full error={errors.company?.message}>
            <Input {...register('company')} placeholder="e.g. Linear Labs" />
          </Field>
          
          <Field label="Category" error={errors.category?.message}>
            <Select {...register('category')}>
              <option value="">Select Category</option>
              {["Engineering", "Design", "Marketing", "Sales"].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          
          <Field label="Experience Level" error={errors.experienceLevel?.message}>
            <Select {...register('experienceLevel')}>
              <option value="">Select Level</option>
              {["Junior", "Mid", "Senior", "Lead"].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          
          <Field label="Location" error={errors.location?.message}>
            <Input {...register('location')} placeholder="Remote · EU" />
          </Field>
          
          <Field label="Salary (optional)" error={errors.salary?.message}>
            <Input {...register('salary')} placeholder="$120k–$150k" />
          </Field>
          
          <Field label="Job Description" full error={errors.description?.message}>
            <textarea 
              {...register('description')} 
              rows={5}
              placeholder="Describe the role, responsibilities, and ideal candidate..."
              className="w-full px-4 py-3 rounded-xl bg-card border border-input text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-[color-mix(in_oklab,var(--primary)_15%,transparent)] resize-y" 
            />
          </Field>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Job'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
