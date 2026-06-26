import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/store/slices/userSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { format } from 'date-fns';
import { Search, Users } from 'lucide-react';
import Pagination from '@/components/Pagination';
import TableShell from '@/components/ui/TableShell';
import EmptyState from '@/components/ui/EmptyState';
import Th from '@/components/ui/Th';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

const UsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, total, totalPages } = useSelector((state: RootState) => state.users);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ page }));
  }, [dispatch, page]);

  // Client side search for simplicity as backend might not support it out of the box in this setup.
  // Alternatively, just filter the fetched users.
  const filtered = users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground mt-1">All registered accounts on the platform · {total} total</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="pl-10" />
        </div>
      </div>

      <TableShell footer={<Pagination page={page} totalPages={totalPages} setPage={setPage} />}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-muted/50 text-left">
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined On</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="py-16 text-center text-muted-foreground">Loading users...</div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState icon={Users} title="No users found" description="No users match your criteria." />
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                        {u.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">
                    <Badge tone={u.role === "ADMIN" ? "primary" : "neutral"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(u.createdAt), 'MMM dd, yyyy')}
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

export default UsersList;
