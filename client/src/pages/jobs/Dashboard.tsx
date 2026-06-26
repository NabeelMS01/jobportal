import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useJobs } from '@/hooks/useJobs';
import Pagination from '@/components/Pagination';
import PageHeader from '@/components/ui/PageHeader';
import { Table, Thead, Tbody, Tr, Th, Td, TableLoading, TableEmpty } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

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
    <div className="space-y-6">
      <PageHeader 
        title="Job Listings" 
        description={`Manage your company's open positions (${total} total)`} 
        action={
          <Button onClick={() => navigate('/jobs/new')}>
            <Plus className="w-5 h-5 mr-2 -ml-1" />
            Create New Job
          </Button>
        }
      />

      <div className="bg-white p-4 shadow sm:rounded-lg border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select
            value={experienceLevel}
            onChange={handleExperienceLevelChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white"
          >
            <option value="">All Levels</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
        <div className="flex-1"></div>
        {(category || experienceLevel) && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium pb-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      <Table>
        <Thead>
          <Th>Title / Company</Th>
          <Th>Category</Th>
          <Th>Location</Th>
          <Th>Posted On</Th>
          <Th align="right">Actions</Th>
        </Thead>
        <Tbody>
          {loading ? (
            <TableLoading colSpan={5} />
          ) : jobs.length === 0 ? (
            <TableEmpty colSpan={5} message="No jobs found." />
          ) : (
            jobs.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.company}</div>
                </Td>
                <Td>
                  <Badge variant="blue">{job.category}</Badge>
                </Td>
                <Td className="text-sm text-gray-500">
                  {job.location}
                </Td>
                <Td className="text-sm text-gray-500">
                  {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                </Td>
                <Td className="text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/jobs/edit/${job.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
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

export default Dashboard;
