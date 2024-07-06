import React from 'react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-customBlue text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-2xl font-bold">
            NHIF Admin
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/admin/actions" className="hover:text-gray-200">
                Admin Actions
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome to the NHIF Admin Dashboard. Here you can manage members and providers.</p>
      </div>
    </div>
  );
}
export default AdminDashboard;
