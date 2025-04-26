import { useState } from 'react';
import { BACKEND_URL } from '../utils/servicesData';

const useAuthForm = (initialState, apiEndpoint, onSuccess) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Auth action failed`);
      }

      const responseData = await response.json();
      onSuccess(responseData);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (newState = initialState) => {
    setFormData(newState);
    setError(null);
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData
  };
};

export default useAuthForm;