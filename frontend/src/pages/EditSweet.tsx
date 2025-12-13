import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SweetForm from '../components/Layout/SweetForm';
import { sweetAPI } from '../services/api';
import { SweetFormData } from '../types';

const EditSweet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<SweetFormData | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchSweet = useCallback(async () => {
    try {
      setLoading(true);
      const response = await sweetAPI.getAll();
      const sweet = response.data.sweets.find((s: any) => s.id === parseInt(id!));
      
      if (!sweet) {
        setError('Sweet not found');
        return;
      }

      setInitialData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description || '',
      });
    } catch (error) {
      setError('Failed to load sweet');
      console.error('Error fetching sweet:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSweet();
  }, [fetchSweet]);

  // fetchSweet defined above via useCallback

  const handleSubmit = async (data: SweetFormData) => {
    setIsLoading(true);
    try {
      await sweetAPI.update(parseInt(id!), data);
      alert('Sweet updated successfully!');
      navigate('/admin');
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading sweet details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Sweet</h1>
        <p className="text-gray-600">Update the details of this sweet</p>
      </div>
      
      {initialData && (
        <SweetForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default EditSweet;