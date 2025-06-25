'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ navigation, userRole, className = '' }) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Hotel Dashboard</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {userRole.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {userRole === 'owner' ? 'Owner' : 'Staff'}
            </p>
            <p className="text-xs font-medium text-gray-500">
              {userRole === 'owner' ? 'Administrator' : 'Team Member'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}