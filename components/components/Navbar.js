"use client";
import Link from "next/link";
import { useAuth } from "@Context/AuthContext/AuthContext";
import PermissionGate from "./role-and-permissions-handle/PermissionGate";

const Navbar = () => {
  const { isLogin, userName, userRole, handleLogout, isDropdownOpen, setIsDropdownOpen } = useAuth();

  if (!isLogin) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Your App
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              
              <PermissionGate requiredPermissions={['properties']}>
                <Link href="/properties" className="text-gray-700 hover:text-blue-600">
                  Properties
                </Link>
              </PermissionGate>
              
              <PermissionGate requiredPermissions={['reports']}>
                <Link href="/reports" className="text-gray-700 hover:text-blue-600">
                  Reports
                </Link>
              </PermissionGate>
              
              <PermissionGate requiredPermissions={['users']} requiredAccessLevel={100}>
                <Link href="/admin/users" className="text-gray-700 hover:text-blue-600">
                  User Management
                </Link>
              </PermissionGate>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <span>{userName}</span>
              <span className="text-sm text-gray-500">({userRole})</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;