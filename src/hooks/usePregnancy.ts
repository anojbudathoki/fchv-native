import { useState } from 'react';
import { createPregnancy, getPregnancyById, updatePregnancy } from './database/models/PregnantWomenModal';
import { CreatePregnancyPayload } from './database/types/pregnancyModal';

export const usePregnancy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addPregnancy = async (data: Omit<CreatePregnancyPayload, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createPregnancy(data);
      return { success: true, id: result.id };
    } catch (err: any) {
      console.error('Error adding pregnancy:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const getPregnancy = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await getPregnancyById(id);
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const editPregnancy = async (id: string, data: Partial<CreatePregnancyPayload>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePregnancy(id, data);
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addPregnancy,
    getPregnancy,
    editPregnancy,
    isLoading,
    error,
  };
};
