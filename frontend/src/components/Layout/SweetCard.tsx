import React from 'react';
import { Sweet } from '../../types';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

interface SweetCardProps {
  sweet: Sweet;
  onDelete?: (id: number) => void;
  onRestock?: (id: number) => void;
  isAdmin: boolean;
}

const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onDelete, 
  onRestock,
  isAdmin 
}) => {
  const { addToCart } = useCart();
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold">{sweet.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{sweet.description}</p>
          </div>
          <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {sweet.category}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-primary-600">
            ₹{sweet.price.toFixed(2)}
          </span>
          <div className="text-right">
            <div className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
            </div>
            {!isOutOfStock && (
              <div className="text-xs text-gray-500">Available</div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(sweet)}
            disabled={isOutOfStock}
            className={`flex-1 py-2 px-4 rounded font-medium transition ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-secondary-600 text-white hover:bg-secondary-700'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          {isAdmin && (
            <>
              <Link
                to={`/admin/edit/${sweet.id}`}
                className="py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Edit
              </Link>
              {onRestock && (
                <button
                  onClick={() => onRestock(sweet.id)}
                  className="py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Restock
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(sweet.id)}
                  className="py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;