/**
 * Admin Authentication Hook
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { adminService, AdminUser } from '@/services/adminService';

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  checkAdminAccess: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminUser: null,
  loading: true,
  checkAdminAccess: async () => false
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAccess = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const hasAccess = await adminService.isAdmin();
      
      if (hasAccess) {
        const profile = await adminService.getAdminProfile();
        setAdminUser(profile);
        setIsAdmin(true);
        return true;
      } else {
        setIsAdmin(false);
        setAdminUser(null);
        return false;
      }
    } catch (error) {
      console.error('Admin access check failed:', error);
      setIsAdmin(false);
      setAdminUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  return (
    <AdminContext.Provider value={{
      isAdmin,
      adminUser,
      loading,
      checkAdminAccess
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};