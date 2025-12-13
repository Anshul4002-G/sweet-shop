import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Manage sweets and site settings.</p>
      <div className="space-x-2">
        <Link to="/admin/add" className="btn">Add Sweet</Link>
        <Link to="/dashboard" className="btn">View Store</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
