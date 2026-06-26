import { format } from 'date-fns';
import { Eye, X } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import Pagination from '@/components/Pagination';
import PageHeader from '@/components/ui/PageHeader';
import { Table, Thead, Tbody, Tr, Th, Td, TableLoading, TableEmpty } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';

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
    <div className="space-y-6">
      <PageHeader 
        title="Job Applications" 
        description={`View and manage submitted job applications (${total} total)`} 
      />

      <Table>
        <Thead>
          <Th>Candidate</Th>
          <Th>Job Details</Th>
          <Th>Applied On</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Thead>
        <Tbody>
          {loading ? (
            <TableLoading colSpan={5} />
          ) : applications.length === 0 ? (
            <TableEmpty colSpan={5} message="No applications found." />
          ) : (
            applications.map((app) => (
              <Tr key={app.id}>
                <Td>
                  <div className="text-sm font-medium text-gray-900">{app.user.name}</div>
                  <div className="text-sm text-gray-500">{app.user.email}</div>
                </Td>
                <Td>
                  <div className="text-sm font-medium text-gray-900">{app.job.title}</div>
                  <div className="text-sm text-gray-500">{app.job.company}</div>
                </Td>
                <Td className="text-sm text-gray-500">
                  {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                </Td>
                <Td>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`mt-1 block w-full py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 ${
                      app.status === 'PENDING' ? 'bg-yellow-50 text-yellow-800' :
                      app.status === 'REVIEWED' ? 'bg-blue-50 text-blue-800' :
                      app.status === 'APPROVED' ? 'bg-green-50 text-green-800' :
                      'bg-red-50 text-red-800'
                    }`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </Td>
                <Td>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600 hover:text-blue-900 flex items-center font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Candidate Info</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-900"><span className="font-medium">Name:</span> {selectedApp.user.name}</p>
                  <p className="text-sm text-gray-900"><span className="font-medium">Email:</span> {selectedApp.user.email}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Job Info</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-900"><span className="font-medium">Title:</span> {selectedApp.job.title}</p>
                  <p className="text-sm text-gray-900"><span className="font-medium">Company:</span> {selectedApp.job.company}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Application Status</h4>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <span className="font-medium">Status:</span> 
                    <Badge variant={
                      selectedApp.status === 'APPROVED' ? 'green' : 
                      selectedApp.status === 'REJECTED' ? 'red' : 
                      selectedApp.status === 'REVIEWED' ? 'blue' : 'yellow'
                    }>
                      {selectedApp.status}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-900"><span className="font-medium">Applied on:</span> {format(new Date(selectedApp.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
