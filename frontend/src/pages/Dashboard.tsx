import React, { useState, useEffect, useCallback } from 'react';
import SweetCard from '../components/Layout/SweetCard';
import { sweetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sweet } from '../types';

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const fetchSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await sweetAPI.getAll();
      const sweetsData: Sweet[] = response.data.sweets;
      setSweets(sweetsData);
      setFilteredSweets(sweetsData);
      const uniqueCategories: string[] = Array.from(
        new Set(sweetsData.map((sweet: Sweet) => sweet.category))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching sweets:', error);
      setError('Failed to load sweets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const filterSweets = useCallback(() => {
    let filtered = sweets;

    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(sweet =>
        sweet.category === selectedCategory
      );
    }

    setFilteredSweets(filtered);
  }, [searchTerm, selectedCategory, sweets]);

  useEffect(() => {
    filterSweets();
  }, [filterSweets]);

  // fetchSweets and filterSweets defined above with useCallback

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading sweets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchSweets}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Sweets</h1>
        <p className="text-gray-600 mb-6">Browse and purchase from our delicious collection</p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search sweets by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sweets found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map(sweet => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              isAdmin={user?.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;