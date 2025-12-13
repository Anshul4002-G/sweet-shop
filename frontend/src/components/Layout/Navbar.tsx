import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getItemCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-7">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="text-5xl font-bold mb-4 md:mb-0">
            🍬 Sweet Shop
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-lg md:text-xl font-bold">
                  Welcome, <span className="font-bold">{user?.name}</span>!
                </span>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="px-3 py-2 rounded hover:bg-primary-600 transition text-lg font-bold"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/add"
                      className="px-3 py-2 rounded bg-green-600 hover:bg-green-700 transition text-lg font-bold"
                    >
                      Add Sweet
                    </Link>
                  </>
                )}
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded hover:bg-primary-600 transition text-lg font-bold"
                >
                  Browse Sweets
                </Link>
                <Link
                  to="/cart"
                  className="px-3 py-2 rounded hover:bg-primary-600 transition text-lg font-bold relative"
                >
                  🛒 Cart
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-lg font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded hover:bg-primary-600 transition text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 transition text-lg font-bold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;