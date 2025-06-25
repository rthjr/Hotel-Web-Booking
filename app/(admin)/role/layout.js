// app/(admin)/layout.jsx
import ProtectedRoute from "@components/components/role-and-permissions-handle/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={["users"]}
      requiredAccessLevel={100} 
      fallbackPath="/dashboard"
    >
      {children}
    </ProtectedRoute>
  );
}