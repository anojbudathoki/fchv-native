import { useState } from 'react';
import { createPregnancy } from './database/models/PregnantWomenModal';
import { CreatePregnancyPayload } from './database/types/pregnancyModal';

export const usePregnancy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addPregnancy = async (data: Omit<CreatePregnancyPayload, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    try {
    console.log({data})
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

  return {
    addPregnancy,
    isLoading,
    error,
  };
};
