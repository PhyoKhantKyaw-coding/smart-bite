import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/UseAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Camera, 
  Save, 
  X, 
  Edit,
  Shield,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserById } from '@/api/user';

// User DTO interface based on C# GetUserDTO
interface UserProfile {
  userId?: string;
  roleName?: string;
  userName?: string;
  userPassword?: string;
  userEmail?: string;
  userProfile?: string;
  userPhNo?: string;
  googleTokenId?: string;
  latitude?: number;
  longitude?: number;
  deviceToken?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserById(user.userId);
        if (response.status === 'Success' && response.data) {
          setProfile(response.data);
          setEditedProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.userId]);

  const handleEdit = () => {
    if (profile) {
      setIsEditing(true);
      setEditedProfile(profile);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Helper function to get profile image URL
  const getProfileImageUrl = (profilePath?: string) => {
    if (!profilePath) return undefined;
    
    if (profilePath.startsWith('http://') || profilePath.startsWith('https://')) {
      return profilePath;
    }
    
    return `https://localhost:7112/api/${profilePath}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if no profile
  if (!profile) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-20">
          <User className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600">Failed to load profile data</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 gradient-primary"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      // TODO: Replace with actual API call
      // await updateUserProfile(editedProfile);
      
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
      console.error(error);
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProfile) return;
    
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({
          ...editedProfile,
          userProfile: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      toast.success('Profile picture uploaded!');
    }
  };

  const getCurrentLocation = () => {
    if (!editedProfile) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEditedProfile({
            ...editedProfile,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success('Location updated successfully!');
        },
        (error) => {
          toast.error('Failed to get location');
          console.error(error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          My Profile
        </h1>
        {!isEditing && (
          <Button 
            onClick={handleEdit}
            className="gradient-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-orange-100">
                <AvatarImage src={isEditing && editedProfile ? getProfileImageUrl(editedProfile.userProfile) : getProfileImageUrl(profile.userProfile)} />
                <AvatarFallback className="text-4xl" style={{ background: "#f97316", color: "#fff" }}>
                  {profile.userName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{profile.userName}</h2>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {profile.userEmail}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                <Badge className="gradient-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.roleName}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Manage your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <Input
                value={editedProfile?.userName || ''}
                onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, userName: e.target.value })}
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.userName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2 text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
              <Mail className="w-4 h-4 text-gray-500" />
              {profile.userEmail}
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <Input
                  value={editedProfile?.userPhNo || ''}
                  onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, userPhNo: e.target.value })}
                  placeholder="+95 9 123 456 789"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                <Phone className="w-4 h-4 text-gray-500" />
                {profile.userPhNo || 'Not provided'}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Latitude, Longitude)
            </label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    step="any"
                    value={editedProfile?.latitude || ''}
                    onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, latitude: parseFloat(e.target.value) })}
                    placeholder="Latitude"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="any"
                    value={editedProfile?.longitude || ''}
                    onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, longitude: parseFloat(e.target.value) })}
                    placeholder="Longitude"
                    className="flex-1"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={getCurrentLocation}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                <MapPin className="w-4 h-4 text-gray-500" />
                {profile.latitude && profile.longitude
                  ? `${profile.latitude.toFixed(4)}, ${profile.longitude.toFixed(4)}`
                  : 'Not provided'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isChangingPassword ? (
            <Button 
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePasswordChange}
                  className="flex-1 gradient-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Google Account Integration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Account
            </label>
            <div className="flex items-center gap-2 text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
              {profile.googleTokenId ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600">
                  Not Connected
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="min-w-[120px]"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="gradient-primary min-w-[120px]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
