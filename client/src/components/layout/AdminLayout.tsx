import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { LogOut, Briefcase, LayoutDashboard, Users, FileText } from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg";
    if (isActive(path)) {
      return `${baseClasses} bg-blue-50 text-blue-700`;
    }
    return `${baseClasses} hover:bg-gray-100 text-gray-700`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Briefcase className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900">TNP Admin</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            to="/"
            className={getLinkClasses('/')}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/applications"
            className={getLinkClasses('/applications')}
          >
            <FileText className="w-5 h-5 mr-3" />
            Applications
          </Link>
          <Link
            to="/users"
            className={getLinkClasses('/users')}
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">Job Portal Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
