import { useState, useEffect } from 'react';
import { Users, UserPlus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getAllUsers, addUser, updateUser, deleteUser } from '@/api/user';
import type { GetUserDTO, AddUserDTO, UserDTO } from '@/api/user/types';
import UserTable from './chunks/UserTable';
import AddEditUserDialog from './chunks/AddEditUserDialog';

const UserView = () => {
  const [users, setUsers] = useState<GetUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GetUserDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();
      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: GetUserDTO) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSaveUser = async (data: AddUserDTO) => {
    setIsSaving(true);
    try {
      if (selectedUser && selectedUser.userId) {
        // Update existing user
        const updateData: UserDTO = {
          userId: selectedUser.userId,
          roleId: data.roleName === 'Admin' ? '1' : '2', // Assuming roleId mapping
          userName: data.userName,
          userPassword: data.userPassword,
          userEmail: data.userEmail,
          userPhNo: data.userPhNo,
          latitude: data.latitude,
          longitude: data.longitude,
          deviceToken: data.deviceToken,
        };
        await updateUser(updateData);
        toast.success('User updated successfully!');
      } else {
        // Add new user
        await addUser(data);
        toast.success('User added successfully!');
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(userId);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.roleName === 'Admin').length,
    customers: users.filter(u => u.roleName === 'User').length,
    verified: users.filter(u => u.userEmail).length,
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: isDark ? '#18181b' : '#f9fafb' }}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-sm" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
              Manage system users, roles, and permissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchUsers}
              variant="outline"
              className="gap-2"
              style={{
                backgroundColor: isDark ? '#27272a' : '#fff',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? '#3f3f46' : '#e4e4e7',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={handleAddUser}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              <UserPlus className="w-4 h-4" />
              Add New User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderColor: isDark ? '#164e63' : '#e0f2fe',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#67e8f9' : '#0891b2' }}>
                  Total Users
                </p>
                <p className="text-3xl font-bold mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                  {stats.total}
                </p>
              </div>
              <Users className="w-10 h-10" style={{ color: '#06b6d4', opacity: 0.6 }} />
            </div>
          </div>

          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
              borderColor: isDark ? '#5b21b6' : '#ede9fe',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#c4b5fd' : '#7c3aed' }}>
                  Administrators
                </p>
                <p className="text-3xl font-bold mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                  {stats.admins}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
                <span className="text-xl" style={{ color: '#8b5cf6' }}>👑</span>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderColor: isDark ? '#166534' : '#dcfce7',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#86efac' : '#16a34a' }}>
                  Customers
                </p>
                <p className="text-3xl font-bold mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                  {stats.customers}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
                <span className="text-xl" style={{ color: '#22c55e' }}>👤</span>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(251, 146, 60, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
              borderColor: isDark ? '#9a3412' : '#fed7aa',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#fdba74' : '#ea580c' }}>
                  Verified
                </p>
                <p className="text-3xl font-bold mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                  {stats.verified}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)' }}>
                <span className="text-xl" style={{ color: '#fb923c' }}>✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
      />

      {/* Add/Edit Dialog */}
      <AddEditUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        isLoading={isSaving}
      />
    </div>
  );
};

export default UserView;
