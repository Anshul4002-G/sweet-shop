import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SweetForm from '../components/Layout/SweetForm';
import { sweetAPI } from '../services/api';
import { SweetFormData } from '../types';

const AddSweet: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: SweetFormData) => {
    setIsLoading(true);
    try {
      await sweetAPI.create(data);
      alert('Sweet added successfully!');
      navigate('/admin');
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Sweet</h1>
        <p className="text-gray-600">Fill in the details to add a new sweet to your shop</p>
      </div>
      
      <SweetForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEdit={false}
      />
    </div>
  );
};

export default AddSweet;