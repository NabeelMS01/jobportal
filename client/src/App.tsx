import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';

import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/jobs/Dashboard';
import JobForm from './pages/jobs/JobForm';
import UsersList from './pages/users/UsersList';
import ApplicationsList from './pages/applications/ApplicationsList';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="text-xl text-gray-600">Loading...</div></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="jobs/new" element={<JobForm />} />
          <Route path="jobs/edit/:id" element={<JobForm />} />
          <Route path="users" element={<UsersList />} />
          <Route path="applications" element={<ApplicationsList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
