"use client";
import { useAuth } from "@Context/AuthContext/AuthContext";
import { usePermissions } from "@hooks/usePermissions";
import ProtectedRoute from "@components/components/role-and-permissions-handle/ProtectedRoute";
import PermissionGate from "@components/components/role-and-permissions-handle/PermissionGate";
import RoleBasedComponent from "@components/components/role-and-permissions-handle/RoleBasedComponent";

const Dashboard = () => {
  const { userData, userRole, accessLevel } = useAuth();
  const { 
    canManageUsers, 
    canManageProperties, 
    canViewReports,
    hasPermission 
  } = usePermissions();

  return (
    <ProtectedRoute requiredPermissions={['dashboard']} requiredAccessLevel={50}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* User Info */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Welcome, {userData.name}!</h2>
          <p>Role: <span className="font-medium">{userRole}</span></p>
          <p>Access Level: <span className="font-medium">{accessLevel}</span></p>
        </div>

        {/* Role-based navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Admin Section */}
          <PermissionGate 
            requiredPermissions={['users', 'settings']} 
            requiredAccessLevel={100}
          >
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Admin Panel</h3>
              <div className="space-y-2">
                <button className="block w-full text-left p-2 bg-red-100 hover:bg-red-200 rounded">
                  Manage Users
                </button>
                <button className="block w-full text-left p-2 bg-red-100 hover:bg-red-200 rounded">
                  System Settings
                </button>
              </div>
            </div>
          </PermissionGate>

          {/* Owner Section */}
          <PermissionGate 
            requiredPermissions={['properties']} 
            requiredAccessLevel={80}
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Property Management</h3>
              <div className="space-y-2">
                <button className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded">
                  Manage Properties
                </button>
                <button className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded">
                  Reservations
                </button>
              </div>
            </div>
          </PermissionGate>

          {/* Reports Section (Admin & Owner) */}
          <PermissionGate 
            requiredPermissions={['reports']} 
            requiredAccessLevel={80}
          >
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Reports</h3>
              <div className="space-y-2">
                <button className="block w-full text-left p-2 bg-green-100 hover:bg-green-200 rounded">
                  Financial Reports
                </button>
                <button className="block w-full text-left p-2 bg-green-100 hover:bg-green-200 rounded">
                  Analytics
                </button>
              </div>
            </div>
          </PermissionGate>
        </div>

        {/* Role-based content using RoleBasedComponent */}
        <RoleBasedComponent
          adminComponent={
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Admin Dashboard</h3>
              <p>Full system access and control panel</p>
            </div>
          }
          ownerComponent={
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Owner Dashboard</h3>
              <p>Property and reservation management</p>
            </div>
          }
          userComponent={
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">User Dashboard</h3>
              <p>Profile and booking management</p>
            </div>
          }
        />

        {/* Conditional rendering with helper functions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {canManageUsers() && (
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                User Management
              </button>
            )}
            
            {canManageProperties() && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Property Management
              </button>
            )}
            
            {canViewReports() && (
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                View Reports
              </button>
            )}
            
            {hasPermission('profile') && (
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Permission debugging (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <p>Permissions: {JSON.stringify(userData.permissions || [])}</p>
            <p>Access Level: {accessLevel}</p>
            <p>Role: {userRole}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;