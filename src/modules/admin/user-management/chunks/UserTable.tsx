import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Mail, Phone, MapPin, Shield, User as UserIcon } from 'lucide-react';
import type { GetUserDTO } from '@/api/user/types';

interface UserTableProps {
  users: GetUserDTO[];
  onEdit: (user: GetUserDTO) => void;
  onDelete: (userId: string) => void;
  isLoading: boolean;
}

const UserTable = ({ users, onEdit, onDelete, isLoading }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<GetUserDTO[]>(users);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userPhNo?.includes(searchTerm) ||
      user.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div
        className="p-4 rounded-xl border backdrop-blur-sm"
        style={{
          backgroundColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
        }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#06b6d4' }} />
          <Input
            placeholder="Search by name, email, phone, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-base border-0"
            style={{
              backgroundColor: isDark ? '#27272a' : '#f4f4f5',
              color: isDark ? '#fff' : '#000',
            }}
          />
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border"
          style={{
            backgroundColor: isDark ? '#27272a' : '#fff',
            borderColor: isDark ? '#3f3f46' : '#e4e4e7',
          }}
        >
          <UserIcon className="w-16 h-16 mx-auto mb-4" style={{ color: isDark ? '#52525b' : '#d4d4d8' }} />
          <p className="text-lg font-medium" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
            {searchTerm ? 'No users found matching your search' : 'No users available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.userId}
              className="group relative rounded-xl border p-6 hover:shadow-2xl transition-all duration-300"
              style={{
                backgroundColor: isDark ? '#27272a' : '#fff',
                borderColor: isDark ? '#3f3f46' : '#e4e4e7',
              }}
            >
              {/* Role Badge - Top Right */}
              <div className="absolute top-1 right-2">
                <Badge
                  className="gap-1.5 px-3 py-1"
                  style={{
                    backgroundColor: user.roleName === 'Admin'
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'rgba(34, 197, 94, 0.15)',
                    color: user.roleName === 'Admin' ? '#8b5cf6' : '#22c55e',
                    border: `1px solid ${user.roleName === 'Admin' ? '#8b5cf6' : '#22c55e'}`,
                  }}
                >
                  <Shield className="w-3 h-3" />
                  {user.roleName || 'User'}
                </Badge>
              </div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden"
                  style={{
                    background: user.userProfile 
                      ? 'transparent'
                      : user.roleName === 'Admin'
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                      : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#fff',
                  }}
                >
                  {user.userProfile ? (
                    <img
                      src={
                        user.userProfile.startsWith('http://') || user.userProfile.startsWith('https://')
                          ? user.userProfile
                          : `https://localhost:7112/api/${user.userProfile}`
                      }
                      alt={user.userName || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background with initial if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.background = user.roleName === 'Admin'
                            ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                            : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)';
                          parent.textContent = user.userName?.charAt(0).toUpperCase() || '?';
                        }
                      }}
                    />
                  ) : (
                    user.userName?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                    {user.userName || 'Unnamed User'}
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>
                    ID: {user.userId?.substring(0, 8)}...
                  </p>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 mb-6">
                {user.userEmail && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }}
                    >
                      <Mail className="w-4 h-4" style={{ color: '#06b6d4' }} />
                    </div>
                    <span className="text-sm truncate flex-1" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                      {user.userEmail}
                    </span>
                  </div>
                )}
                {user.userPhNo && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }}
                    >
                      <Phone className="w-4 h-4" style={{ color: '#22c55e' }} />
                    </div>
                    <span className="text-sm" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                      {user.userPhNo}
                    </span>
                  </div>
                )}
                {user.latitude && user.longitude && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: '#f97316' }} />
                    </div>
                    <span className="text-xs" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>
                      {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                <Button
                  onClick={() => onEdit(user)}
                  variant="outline"
                  className="flex-1 gap-2"
                  style={{
                    backgroundColor: isDark ? '#3f3f46' : '#f4f4f5',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d4d4d8',
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(user.userId || '')}
                  variant="destructive"
                  className="flex-1 gap-2"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTable;
