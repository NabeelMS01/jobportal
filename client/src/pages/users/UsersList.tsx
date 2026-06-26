import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/store/slices/userSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { format } from 'date-fns';
import Pagination from '@/components/Pagination';
import PageHeader from '@/components/ui/PageHeader';
import { Table, Thead, Tbody, Tr, Th, Td, TableLoading, TableEmpty } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';

const UsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, total, totalPages } = useSelector((state: RootState) => state.users);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page }));
  }, [dispatch, page]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Users" 
        description={`View all registered candidates (${total} total)`} 
      />

      <Table>
        <Thead>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Role</Th>
          <Th>Joined On</Th>
        </Thead>
        <Tbody>
          {loading ? (
            <TableLoading colSpan={4} />
          ) : users.length === 0 ? (
            <TableEmpty colSpan={4} message="No users found." />
          ) : (
            users.map((user) => (
              <Tr key={user.id}>
                <Td className="text-sm font-medium text-gray-900">
                  {user.name}
                </Td>
                <Td className="text-sm text-gray-500">
                  {user.email}
                </Td>
                <Td>
                  <Badge variant={user.role === 'ADMIN' ? 'purple' : 'green'}>
                    {user.role}
                  </Badge>
                </Td>
                <Td className="text-sm text-gray-500">
                  {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default UsersList;
