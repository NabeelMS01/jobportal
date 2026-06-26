import { format } from 'date-fns';
import { Eye, X } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import Pagination from '@/components/Pagination';
import TableShell from '@/components/ui/TableShell';
import EmptyState from '@/components/ui/EmptyState';
import Th from '@/components/ui/Th';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

const ApplicationsList = () => {
  const {
    applications,
    loading,
    total,
    totalPages,
    page,
    setPage,
    selectedApp,
    setSelectedApp,
    handleStatusChange,
  } = useApplications();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Job Applications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-semibold text-foreground">{total}</span> applications across all listings
        </p>
      </div>

      <TableShell footer={<Pagination page={page} totalPages={totalPages} setPage={setPage} />}>
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="bg-muted/50 text-left">
              <Th>Candidate</Th>
              <Th>Job Details</Th>
              <Th>Applied On</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="py-16 text-center text-muted-foreground">Loading applications...</div>
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState icon={FileText} title="No applications found" description="There are no applications submitted yet." />
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{app.user.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{app.job.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.job.company}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusSelect value={app.status} onChange={(s) => handleStatusChange(app.id, s)} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <Button size="sm" variant="secondary" onClick={() => setSelectedApp(app)}>
                        <Eye className="h-4 w-4" /> View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableShell>

      {selectedApp && (
        <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
};

import { ChevronDown } from 'lucide-react';

function StatusSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const tones: Record<string, string> = {
    PENDING: "bg-[color-mix(in_oklab,var(--warning)_22%,transparent)] text-[oklch(0.35_0.12_80)] border-[color-mix(in_oklab,var(--warning)_40%,transparent)]",
    REVIEWED: "bg-[color-mix(in_oklab,var(--info)_15%,transparent)] text-[var(--info)] border-[color-mix(in_oklab,var(--info)_35%,transparent)]",
    APPROVED: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)] border-[color-mix(in_oklab,var(--success)_35%,transparent)]",
    REJECTED: "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-[var(--destructive)] border-[color-mix(in_oklab,var(--destructive)_35%,transparent)]",
  };
  return (
    <div className="relative inline-block w-[120px]">
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none h-9 pl-3 pr-8 rounded-lg border text-xs font-semibold outline-none cursor-pointer transition-all focus:ring-4 focus:ring-[color-mix(in_oklab,var(--primary)_15%,transparent)]", 
          tones[value] || tones.PENDING
        )}
      >
        <option value="PENDING">PENDING</option>
        <option value="REVIEWED">REVIEWED</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
      </select>
      <ChevronDown className={cn(
        "absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-70",
        tones[value] ? tones[value].split(' ')[1] : ""
      )} />
    </div>
  );
}

function ApplicationModal({ app, onClose }: { app: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-card rounded-2xl shadow-elegant border border-border overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-extrabold text-lg">Application Details</h3>
            <p className="text-xs text-muted-foreground">Reference #{app.id}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <Section title="Candidate">
            <Row label="Name" value={app.user.name} />
            <Row label="Email" value={app.user.email} />
          </Section>
          <Section title="Job">
            <Row label="Title" value={app.job.title} />
            <Row label="Company" value={app.job.company} />
          </Section>
          <Section title="Application">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge tone={
                app.status === 'APPROVED' ? 'success' : 
                app.status === 'REJECTED' ? 'danger' : 
                app.status === 'REVIEWED' ? 'info' : 'warning'
              }>
                {app.status}
              </Badge>
            </div>
            <Row label="Applied On" value={format(new Date(app.createdAt), 'MMM dd, yyyy')} />
          </Section>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold truncate">{value}</span>
    </div>
  );
}

export default ApplicationsList;
