import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface RoleBasedAccessControlProps {
  children: ReactNode;
  allowedRoles: string[]; // e.g., ['admin', 'instructor', 'premium']
  fallback?: ReactNode; // Component to show if access is denied
}

export const RoleBasedAccessControl: React.FC<RoleBasedAccessControlProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return fallback || <div>Access denied: User not authenticated</div>;
  }

  const hasAccess = allowedRoles.includes(user.subscriptionType) || allowedRoles.includes('all');

  if (!hasAccess) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center text-red-600">Access Denied</h2>
          <p className="mt-4 text-center text-gray-600">
            You do not have the required permissions to access this resource.
          </p>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Required roles: {allowedRoles.join(', ')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Your role: {user.subscriptionType}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Convenience components for common access patterns
export const AdminOnly: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RoleBasedAccessControl allowedRoles={['admin']} fallback={<div>Admin access required</div>}>
    {children}
  </RoleBasedAccessControl>
);

export const PremiumOnly: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RoleBasedAccessControl 
    allowedRoles={['admin', 'premium']} 
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center text-yellow-600">Premium Required</h2>
          <p className="mt-4 text-center text-gray-600">
            This feature requires a premium subscription.
          </p>
          <div className="mt-6 text-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    }
  >
    {children}
  </RoleBasedAccessControl>
);

export const InstructorOnly: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RoleBasedAccessControl allowedRoles={['admin', 'instructor']} fallback={<div>Instructor access required</div>}>
    {children}
  </RoleBasedAccessControl>
);