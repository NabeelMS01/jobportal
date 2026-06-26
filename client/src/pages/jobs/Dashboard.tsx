import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Building2, MapPin, Calendar, Briefcase, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useJobs } from '@/hooks/useJobs';
import Pagination from '@/components/Pagination';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import TableShell from '@/components/ui/TableShell';
import EmptyState from '@/components/ui/EmptyState';
import Th from '@/components/ui/Th';
import IconButton from '@/components/ui/IconButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    jobs,
    loading,
    total,
    totalPages,
    category,
    experienceLevel,
    page,
    setPage,
    handleDelete,
    handleCategoryChange,
    handleExperienceLevelChange,
    handleClearFilters,
  } = useJobs();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Job Listings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total <span className="font-semibold text-foreground">{total}</span> jobs
          </p>
        </div>
        <Button onClick={() => navigate('/jobs/new')}>
          <Plus className="h-4 w-4" /> Create New Job
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-soft flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground px-2">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <div className="min-w-[180px]">
          <Select value={category} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </Select>
        </div>
        <div className="min-w-[180px]">
          <Select value={experienceLevel} onChange={handleExperienceLevelChange}>
            <option value="">All Experience Levels</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </Select>
        </div>
        {(category || experienceLevel) && (
          <button onClick={handleClearFilters} className="text-xs font-semibold text-primary hover:underline ml-auto">
            Clear Filters
          </button>
        )}
      </div>

      <TableShell footer={<Pagination page={page} totalPages={totalPages} setPage={setPage} />}>
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-muted/50 text-left">
              <Th>Title / Company</Th>
              <Th>Category</Th>
              <Th>Location</Th>
              <Th>Posted On</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="py-16 text-center text-muted-foreground">Loading jobs...</div>
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState icon={Briefcase} title="No jobs found" description="Try clearing your filters or create a new job posting." />
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Building2 className="h-3 w-3" />{job.company}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone="primary">{job.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{format(new Date(job.createdAt), 'MMM dd, yyyy')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton label="Edit" onClick={() => navigate(`/jobs/edit/${job.id}`)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Delete" tone="danger" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
};

export default Dashboard;
