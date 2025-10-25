import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  LogOut,
  Loader2,
} from 'lucide-react';
import { getUserById } from '@/api/user';
import type { GetUserDTO } from '@/api/user/types';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    userId?: string;
    userName?: string;
    email?: string;
    userEmail?: string;
    userPhNo?: string;
    role: string;
    roleName?: string;
    userProfile?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: string;
  };
  onLogout?: () => void;
}

const ProfileDialog = ({
  open,
  onOpenChange,
  user,
  onLogout,
}: ProfileDialogProps) => {
  const [isDark, setIsDark] = useState(() =>
    document.body.classList.contains('dark')
  );
  const [profileData, setProfileData] = useState<GetUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch fresh user data when dialog opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (open && user.userId) {
        setIsLoading(true);
        try {
          const response = await getUserById(user.userId);
          if (response.status === 'Success' && response.data) {
            setProfileData(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Use existing user data as fallback
          setProfileData(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [open, user.userId]);

  // Use profileData if available, otherwise fallback to user prop
  const displayData = profileData || user;
  const displayName = displayData.userName || user.userName || user.email || user.userEmail || 'User';
  const displayEmail = displayData.userEmail || user.email || user.userEmail || 'No email';
  const displayRole = displayData.roleName || user.role;

  // Get profile image URL
  const getProfileImageUrl = () => {
    const profilePath = displayData.userProfile || user.userProfile;
    if (!profilePath) return undefined;
    
    if (profilePath.startsWith('http://') || profilePath.startsWith('https://')) {
      return profilePath;
    }
    
    return `https://localhost:7112/api/${profilePath}`;
  };

  // Get role color
  const getRoleColor = () => {
    const role = displayRole.toLowerCase();
    if (role === 'admin') return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6', border: '#8b5cf6' };
    if (role === 'delivery') return { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: '#fb923c' };
    return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: '#22c55e' };
  };

  const roleColor = getRoleColor();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        style={{
          backgroundColor: isDark ? '#18181b' : '#fff',
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#06b6d4' }} />
              <p className="text-sm font-medium" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                Loading profile...
              </p>
            </div>
          </div>
        )}

        {/* Header with Gradient Background */}
        <div
          className="relative h-32"
          style={{
            background:
              displayRole.toLowerCase() === 'admin'
                ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                : displayRole.toLowerCase() === 'delivery'
                ? 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)'
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          }}
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-6 translate-y-6"></div>
          </div>
        </div>

        {/* Profile Avatar - Overlapping Header */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                <AvatarImage
                  src={getProfileImageUrl()}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback
                  className="text-4xl font-bold"
                  style={{
                    background:
                      displayRole.toLowerCase() === 'admin'
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                        : displayRole.toLowerCase() === 'delivery'
                        ? 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)'
                        : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#fff',
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 pb-2">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: isDark ? '#fff' : '#000' }}
              >
                {displayName}
              </h2>
              <Badge
                className="gap-1.5 px-2.5 py-1"
                style={{
                  backgroundColor: roleColor.bg,
                  color: roleColor.text,
                  border: `1px solid ${roleColor.border}`,
                }}
              >
                <Shield className="w-3.5 h-3.5" />
                {displayRole}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 pb-6 space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
            >
              <Mail className="w-5 h-5" style={{ color: '#06b6d4' }} />
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-medium mb-0.5"
                style={{ color: isDark ? '#71717a' : '#a1a1aa' }}
              >
                Email Address
              </p>
              <p
                className="text-sm font-medium truncate"
                style={{ color: isDark ? '#d4d4d8' : '#52525b' }}
              >
                {displayEmail}
              </p>
            </div>
          </div>

          {/* Phone */}
          {displayData.userPhNo && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
              >
                <Phone className="w-5 h-5" style={{ color: '#22c55e' }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-medium mb-0.5"
                  style={{ color: isDark ? '#71717a' : '#a1a1aa' }}
                >
                  Phone Number
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: isDark ? '#d4d4d8' : '#52525b' }}
                >
                  {displayData.userPhNo}
                </p>
              </div>
            </div>
          )}

          {/* User ID */}
          {displayData.userId && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
              >
                <User className="w-5 h-5" style={{ color: '#8b5cf6' }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-medium mb-0.5"
                  style={{ color: isDark ? '#71717a' : '#a1a1aa' }}
                >
                  User ID
                </p>
                <p
                  className="text-sm font-mono"
                  style={{ color: isDark ? '#d4d4d8' : '#52525b' }}
                >
                  {displayData.userId.substring(0, 12)}...
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {displayData.latitude && displayData.longitude && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
              >
                <MapPin className="w-5 h-5" style={{ color: '#f97316' }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-medium mb-0.5"
                  style={{ color: isDark ? '#71717a' : '#a1a1aa' }}
                >
                  Location
                </p>
                <p
                  className="text-sm font-mono"
                  style={{ color: isDark ? '#d4d4d8' : '#52525b' }}
                >
                  {displayData.latitude.toFixed(4)}, {displayData.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {/* Created Date */}
          {(displayData as { createdAt?: string }).createdAt && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
              >
                <Calendar className="w-5 h-5" style={{ color: '#f59e0b' }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-medium mb-0.5"
                  style={{ color: isDark ? '#71717a' : '#a1a1aa' }}
                >
                  Member Since
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: isDark ? '#d4d4d8' : '#52525b' }}
                >
                  {new Date((displayData as { createdAt?: string }).createdAt!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="destructive"
                className="flex-1 gap-2"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
