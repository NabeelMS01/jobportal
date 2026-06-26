import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, deleteJob } from '@/store/slices/jobSlice';
import type { AppDispatch, RootState } from '@/store/store';

export const useJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, total, totalPages, error } = useSelector((state: RootState) => state.jobs);

  const [category, setCategory] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchJobs({ page, category, experienceLevel }));
  }, [dispatch, page, category, experienceLevel]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await dispatch(deleteJob(id));
    }
  }, [dispatch]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  }, []);

  const handleExperienceLevelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setExperienceLevel(e.target.value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setCategory('');
    setExperienceLevel('');
    setPage(1);
  }, []);

  return {
    jobs,
    loading,
    total,
    totalPages,
    error,
    category,
    experienceLevel,
    page,
    setPage,
    handleDelete,
    handleCategoryChange,
    handleExperienceLevelChange,
    handleClearFilters,
  };
};
