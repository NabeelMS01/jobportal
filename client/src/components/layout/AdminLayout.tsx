import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { Briefcase, Users, FileText, LogOut, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Page = "jobs" | "jobForm" | "applications" | "users";

const NAV = [
  { id: "jobs", path: "/", label: "Dashboard", icon: Briefcase },
  { id: "applications", path: "/applications", label: "Applications", icon: FileText },
  { id: "users", path: "/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  // Determine current "page" for sidebar highlighting
  let page: Page = "jobs";
  if (location.pathname.startsWith("/jobs/new") || location.pathname.startsWith("/jobs/edit")) {
    page = "jobForm";
  } else if (location.pathname.startsWith("/applications")) {
    page = "applications";
  } else if (location.pathname.startsWith("/users")) {
    page = "users";
  }

  // Determine title based on location
  const title = page === "jobs" ? "Job Listings" 
    : page === "jobForm" ? (location.pathname.includes("edit") ? "Edit Job" : "Create Job") 
    : page === "applications" ? "Applications" 
    : "Users";

  const adminName = user?.name || "Admin User";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-mesh), var(--color-background)" }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-xl grid place-items-center shadow-elegant" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-base leading-tight">TNP Admin</p>
            <p className="text-[11px] text-muted-foreground">Job Portal Console</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => {
            const active = page === item.id || (item.id === "jobs" && page === "jobForm");
            return (
              <button key={item.id} onClick={() => navigate(item.path)}
                className={cn("w-full flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-semibold transition-all",
                  active
                    ? "text-primary-foreground shadow-elegant [background:var(--gradient-primary)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                <item.icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
                {item.id === "jobs" && active && <span className="ml-auto text-[10px] font-bold opacity-80">JOBS</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-xl p-4 bg-card border border-border">
            <p className="text-xs font-semibold">Need help?</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Visit our docs to get started.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-20 px-6 lg:px-10 flex items-center justify-between gap-4 border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-20">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Admin</p>
            <h1 className="truncate text-xl font-extrabold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-border">
              <div className="h-10 w-10 rounded-full grid place-items-center font-bold text-primary-foreground shadow-elegant" style={{ background: "var(--gradient-primary)" }}>
                {adminName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Welcome,</p>
                <p className="text-sm font-bold truncate">{adminName}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
