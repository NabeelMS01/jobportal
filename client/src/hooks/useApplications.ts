import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, updateApplicationStatus } from '@/store/slices/applicationSlice';
import type { AppDispatch, RootState } from '@/store/store';

export const useApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, total, totalPages, error } = useSelector((state: RootState) => state.applications);

  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchApplications({ page }));
  }, [dispatch, page]);

  const handleStatusChange = useCallback((id: number, newStatus: string) => {
    dispatch(updateApplicationStatus({ id, status: newStatus }));
  }, [dispatch]);

  return {
    applications,
    loading,
    total,
    totalPages,
    error,
    page,
    setPage,
    selectedApp,
    setSelectedApp,
    handleStatusChange,
  };
};
