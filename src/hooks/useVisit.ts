import { useState } from 'react';
import {
  createVisit,
  updateVisit,
  deleteVisit,
  getVisitById,
  getAllVisits,
  VisitListItem,
} from './database/models/VisitModel';
import { CreateVisitPayload } from './database/types/visitModal';

export const useVisit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addVisit = async (
    data: Omit<CreateVisitPayload, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createVisit(data);
      return { success: true, id: result.id };
    } catch (err: any) {
      console.error('Error adding visit:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const editVisit = async (
    id: string,
    data: Partial<CreateVisitPayload>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateVisit(id, data);
      return { success: true };
    } catch (err: any) {
      console.error('Error updating visit:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const removeVisit = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteVisit(id);
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting visit:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const getVisit = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await getVisitById(id);
    } catch (err: any) {
      console.error('Error fetching visit:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllVisits = async (): Promise<VisitListItem[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getAllVisits();
    } catch (err: any) {
      console.error('Error fetching visits:', err);
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addVisit,
    editVisit,
    removeVisit,
    getVisit,
    fetchAllVisits,
    isLoading,
    error,
  };
};
