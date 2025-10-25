import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, Lock, MapPin, Shield } from 'lucide-react';
import type { GetUserDTO, AddUserDTO } from '@/api/user/types';

interface AddEditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: GetUserDTO | null;
  onSave: (data: AddUserDTO) => Promise<void>;
  isLoading: boolean;
}

const AddEditUserDialog = ({ open, onOpenChange, user, onSave, isLoading }: AddEditUserDialogProps) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userPhNo: '',
    latitude: '',
    longitude: '',
    deviceToken: '',
  });
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'User'>('User');
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        userEmail: user.userEmail || '',
        userPassword: '', // Don't populate password for security
        userPhNo: user.userPhNo || '',
        latitude: user.latitude?.toString() || '',
        longitude: user.longitude?.toString() || '',
        deviceToken: user.deviceToken || '',
      });
      setSelectedRole(user.roleName as 'Admin' | 'User' || 'User');
    } else {
      setFormData({
        userName: '',
        userEmail: '',
        userPassword: '',
        userPhNo: '',
        latitude: '',
        longitude: '',
        deviceToken: '',
      });
      setSelectedRole('User');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: AddUserDTO = {
      roleName: selectedRole,
      userName: formData.userName,
      userPassword: formData.userPassword,
      userEmail: formData.userEmail,
      userPhNo: formData.userPhNo,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      deviceToken: formData.deviceToken || undefined,
    };

    await onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl overflow-y-auto"
        style={{
          backgroundColor: isDark ? '#27272a' : '#fff',
          color: isDark ? '#fff' : '#000',
          maxHeight: '90vh',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            {user ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <p className="text-sm" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
            {user ? 'Update user information and permissions' : 'Add a new user to the system'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Role Selection */}
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: isDark ? '#3f3f46' : '#f9fafb',
              borderColor: isDark ? '#52525b' : '#e4e4e7',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5" style={{ color: '#8b5cf6' }} />
              <label className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                User Role *
              </label>
            </div>
            <div className="flex gap-4">
              <label
                className="flex-1 cursor-pointer"
                onClick={() => setSelectedRole('User')}
              >
                <div
                  className="p-4 rounded-lg border-2 transition-all duration-200"
                  style={{
                    backgroundColor: selectedRole === 'User'
                      ? isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.1)'
                      : isDark ? '#27272a' : '#fff',
                    borderColor: selectedRole === 'User' ? '#06b6d4' : isDark ? '#3f3f46' : '#e4e4e7',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: selectedRole === 'User' ? '#06b6d4' : isDark ? '#52525b' : '#d4d4d8',
                      }}
                    >
                      {selectedRole === 'User' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#06b6d4' }}></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                        User
                      </p>
                      <p className="text-xs" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
                        Standard user with basic permissions
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              <label
                className="flex-1 cursor-pointer"
                onClick={() => setSelectedRole('Admin')}
              >
                <div
                  className="p-4 rounded-lg border-2 transition-all duration-200"
                  style={{
                    backgroundColor: selectedRole === 'Admin'
                      ? isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'
                      : isDark ? '#27272a' : '#fff',
                    borderColor: selectedRole === 'Admin' ? '#8b5cf6' : isDark ? '#3f3f46' : '#e4e4e7',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: selectedRole === 'Admin' ? '#8b5cf6' : isDark ? '#52525b' : '#d4d4d8',
                      }}
                    >
                      {selectedRole === 'Admin' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                        Administrator
                      </p>
                      <p className="text-xs" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
                        Full system access and control
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div
            className="p-6 rounded-xl border space-y-4"
            style={{
              backgroundColor: isDark ? '#3f3f46' : '#f9fafb',
              borderColor: isDark ? '#52525b' : '#e4e4e7',
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                  <User className="w-4 h-4" style={{ color: '#06b6d4' }} />
                  Full Name *
                </label>
                <Input
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="h-11"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                  <Mail className="w-4 h-4" style={{ color: '#06b6d4' }} />
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="h-11"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                  <Lock className="w-4 h-4" style={{ color: '#06b6d4' }} />
                  Password {!user && '*'}
                </label>
                <Input
                  type="password"
                  value={formData.userPassword}
                  onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
                  placeholder={user ? 'Leave blank to keep current' : 'Enter password'}
                  required={!user}
                  className="h-11"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                  <Phone className="w-4 h-4" style={{ color: '#06b6d4' }} />
                  Phone Number
                </label>
                <Input
                  value={formData.userPhNo}
                  onChange={(e) => setFormData({ ...formData, userPhNo: e.target.value })}
                  placeholder="+1234567890"
                  className="h-11"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div
            className="p-6 rounded-xl border space-y-4"
            style={{
              backgroundColor: isDark ? '#3f3f46' : '#f9fafb',
              borderColor: isDark ? '#52525b' : '#e4e4e7',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" style={{ color: '#f97316' }} />
              <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                Location (Optional)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="16.7967"
                  className="h-11"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="96.1610"
                  className="h-11"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-12"
              style={{
                backgroundColor: isDark ? '#3f3f46' : '#f4f4f5',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? '#52525b' : '#d4d4d8',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {user ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{user ? 'Update User' : 'Create User'}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditUserDialog;
