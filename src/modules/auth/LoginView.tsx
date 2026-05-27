import React, { useState } from 'react';
import { useAuth } from '@/hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin, registerUser, verifyEmail, resetOTP, forgetPassword, sendOTP } from '@/api/auth';
import { getUserLocation, getDeviceToken } from '@/lib/deviceUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const LoginView = () => {
  const { setAuthUser, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupData, setSignupData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userPhNo: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [signupError, setSignupError] = useState('');

  // OTP Dialog state
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Forget Password Dialog state
  const [showForgetPasswordDialog, setShowForgetPasswordDialog] = useState(false);
  const [forgetPasswordStep, setForgetPasswordStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgetPasswordError, setForgetPasswordError] = useState('');
  const [forgetOtpCode, setForgetOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Pending registration data (stored during OTP flow)
  const [pendingSignup, setPendingSignup] = useState<{
    userName: string;
    userEmail: string;
    userPassword: string;
    userPhNo: string;
    profileImage: File | null;
    location: { latitude: number; longitude: number };
    deviceToken: string;
  } | null>(null);

  const loginMutation = loginUser.useMutation({
    onSuccess: (data) => {
      if (data.status === 0 && data.data?.token) {
        setAuthUser(data.data.token, data.data.userName, data.data.roleName, data.data.userProfile);
        setLoginError('');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    },
    onError: (error) => {
      setLoginError('An error occurred during login');
      console.error(error);
    }
  });

  const googleLoginMutation = googleLogin.useMutation({
    onSuccess: (data) => {
      if (data.status === 0 && data.data?.token) {
        setAuthUser(data.data.token, data.data.userName, data.data.roleName, data.data.userProfile);
      } else {
        setLoginError(data.message || 'Google login failed');
      }
    },
    onError: (error) => {
      setLoginError('An error occurred during Google login');
      console.error(error);
    }
  });

  const signupMutation = registerUser.useMutation({
    onSuccess: (data) => {
      if (data.status === 0) {
        setSignupError('');
        setActiveTab('login');
        setLoginEmail(otpEmail);
      } else {
        setSignupError(data.message || 'Signup failed');
      }
    },
    onError: (error) => {
      setSignupError('An error occurred during signup');
      console.error(error);
    }
  });

  const verifyEmailMutation = verifyEmail.useMutation();

  const resendOtpMutation = resetOTP.useMutation({
    onSuccess: (data) => {
      if (data.data === true) {
        setOtpError('');
      } else {
        setOtpError('Failed to resend OTP');
      }
    },
    onError: (error) => {
      setOtpError('An error occurred while resending OTP');
      console.error(error);
    }
  });

  const forgetPasswordMutation = forgetPassword.useMutation();

  const sendOtpMutation = sendOTP.useMutation();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Countdown timer for forget password OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    loginMutation.mutate({
      UserEmail: loginEmail,
      Password: loginPassword
    });
  };

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    console.log('Google login success:', credentialResponse);
    if (credentialResponse.credential) {
      // This is the JWT token that your backend expects
      googleLoginMutation.mutate(credentialResponse.credential);
    } else {
      setLoginError('Failed to get Google credentials');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setLoginError('Google login failed');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    try {
      const location = await getUserLocation();
      const deviceToken = getDeviceToken();

      setPendingSignup({
        userName: signupData.userName,
        userEmail: signupData.userEmail,
        userPassword: signupData.userPassword,
        userPhNo: signupData.userPhNo,
        profileImage,
        location,
        deviceToken
      });

      sendOtpMutation.mutate(
        { email: signupData.userEmail, type: 'Register' },
        {
          onSuccess: (data) => {
            if (data.status === 0) {
              setOtpEmail(signupData.userEmail);
              setShowOtpDialog(true);
              setSignupError('');
              setSignupData({ userName: '', userEmail: '', userPassword: '', userPhNo: '' });
              setProfileImage(null);
            } else {
              setSignupError(data.message || 'Failed to send OTP');
              setPendingSignup(null);
            }
          },
          onError: () => {
            setSignupError('Failed to send OTP');
            setPendingSignup(null);
          }
        }
      );
    } catch (error) {
      setSignupError('Failed to get location or device information');
      console.error(error);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    verifyEmailMutation.mutate(
      { email: otpEmail, otp: otpCode },
      {
        onSuccess: (data) => {
          if (data.status === 0) {
            setOtpError('');
            setShowOtpDialog(false);

            if (pendingSignup) {
              const formData = new FormData();
              formData.append('UserName', pendingSignup.userName);
              formData.append('UserEmail', pendingSignup.userEmail);
              formData.append('UserPassword', pendingSignup.userPassword);
              formData.append('UserPhNo', pendingSignup.userPhNo);
              formData.append('RoleName', 'User');
              formData.append('Latitude', pendingSignup.location.latitude.toString());
              formData.append('Longitude', pendingSignup.location.longitude.toString());
              formData.append('DeviceToken', pendingSignup.deviceToken);
              formData.append('OTP', otpCode);
              if (pendingSignup.profileImage) {
                formData.append('UserProfileFile', pendingSignup.profileImage);
              }

              signupMutation.mutate(formData);
              setPendingSignup(null);
            } else {
              setActiveTab('login');
              setLoginEmail(otpEmail);
            }
          } else {
            setOtpError('Invalid OTP code');
          }
        },
        onError: () => {
          setOtpError('An error occurred during verification');
        }
      }
    );
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(otpEmail);
  };

  const handleSendForgetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgetPasswordError('');

    sendOtpMutation.mutate(
      { email: forgetPasswordEmail, type: 'ForgetPassword' },
      {
        onSuccess: (data) => {
          if (data.status === 0) {
            setCountdown(30);
            setForgetPasswordStep('otp');
            setForgetPasswordError('');
          } else {
            setForgetPasswordError(data.message || 'Failed to send OTP');
          }
        },
        onError: () => {
          setForgetPasswordError('Failed to send OTP');
        }
      }
    );
  };

  const handleVerifyForgetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgetPasswordError('');

    verifyEmailMutation.mutate(
      { email: forgetPasswordEmail, otp: forgetOtpCode },
      {
        onSuccess: (data) => {
          if (data.status === 0) {
            setForgetPasswordStep('reset');
            setForgetPasswordError('');
          } else {
            setForgetPasswordError('Invalid OTP code');
          }
        },
        onError: () => {
          setForgetPasswordError('An error occurred during verification');
        }
      }
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgetPasswordError('');

    forgetPasswordMutation.mutate(
      { email: forgetPasswordEmail, newPassword },
      {
        onSuccess: (data) => {
          if (data.status === 0) {
            setShowForgetPasswordDialog(false);
            setForgetPasswordError('');
            setForgetPasswordStep('email');
            setForgetOtpCode('');
            setCountdown(0);
            setLoginEmail(forgetPasswordEmail);
          } else {
            setForgetPasswordError(data.message || 'Failed to reset password');
          }
        },
        onError: () => {
          setForgetPasswordError('An error occurred while resetting password');
        }
      }
    );
  };

  if (user) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* HeroSection Background */}
      <div className="absolute inset-0">
        <section className="relative w-full h-full overflow-hidden text-yellow-900" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)' }}>
          {/* Map illustration background */}
          <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <rect x="0" y="0" width="1200" height="800" fill="#fef9c3" />
            
            {/* Curved road path */}
            <path d="M 80 720 C 200 720, 250 560, 320 560 C 390 560, 430 720, 500 720 C 570 720, 610 480, 680 480 C 750 480, 790 640, 860 640 C 930 640, 1000 280, 1120 200" 
              stroke="#fbbf24" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
            
            {/* Store icon at start */}
            <g transform="translate(60, 700)">
              <rect x="0" y="0" width="40" height="40" rx="8" fill="#34d399" />
              <text x="20" y="28" fontSize="24" textAnchor="middle" fill="#fff">🏪</text>
            </g>
            
            {/* Customer home at end */}
            <g transform="translate(1100, 180)">
              <rect x="0" y="0" width="40" height="40" rx="8" fill="#f472b6" />
              <text x="20" y="28" fontSize="24" textAnchor="middle" fill="#fff">🏠</text>
            </g>
          </svg>

          {/* Raining food icons */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {[...Array(30)].map((_, i) => {
              const icons = ["🍔","🍕","🍣","🍜","🍟","🥗","🍩","🍦"];
              const icon = icons[i % icons.length];
              const left = Math.random() * 98;
              const duration = 4 + Math.random() * 4;
              const delay = Math.random() * 3;
              return (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    top: '-40px',
                    fontSize: `${20 + Math.random() * 16}px`,
                    opacity: 0.15 + Math.random() * 0.2,
                    animation: `foodRain ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }}
                >{icon}</span>
              );
            })}
            <style>{`
              @keyframes foodRain {
                0% { top: -40px; }
                100% { top: 100vh; }
              }
            `}</style>
          </div>
        </section>
      </div>

      {/* Auth Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border-4 border-yellow-400 relative">
          {/* Close button (X) --> back to Home */}
          <button
            aria-label="Close"
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="grid md:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden md:flex flex-col justify-center p-12 text-white bg-linear-to-br from-yellow-400 to-yellow-600">
              <h2 className="text-4xl font-bold mb-4">Smart Bite</h2>
              <p className="text-lg mb-6">Delicious Food, Delivered Fast</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍔</span>
                  <span>Wide variety of cuisines</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚴‍♂️</span>
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <span>Top-rated restaurants</span>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="p-8 md:p-12">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  className={`flex-1 pb-4 text-lg font-semibold transition-colors ${
                    activeTab === 'login'
                      ? 'border-b-2 border-yellow-500 text-yellow-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`flex-1 pb-4 text-lg font-semibold transition-colors ${
                    activeTab === 'signup'
                      ? 'border-b-2 border-yellow-500 text-yellow-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium mb-2">Password</label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full"
                      required
                    />
                  </div>
                  {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgetPasswordDialog(true)}
                      className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : 'Login'}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="outline"
                      size="large"
                      width="384"
                      text="signin_with"
                    />
                  </div>
                </form>
              )}

              {/* Signup Form */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupData.userName}
                      onChange={e => setSignupData({...signupData, userName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.userEmail}
                      onChange={e => setSignupData({...signupData, userEmail: e.target.value})}
                      placeholder="your.email@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-phone" className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={signupData.userPhNo}
                      onChange={e => setSignupData({...signupData, userPhNo: e.target.value})}
                      placeholder="+1234567890"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium mb-2">Password</label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.userPassword}
                      onChange={e => setSignupData({...signupData, userPassword: e.target.value})}
                      placeholder="••••••••"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-profile" className="block text-sm font-medium mb-2">Profile Picture (Optional)</label>
                    <Input
                      id="signup-profile"
                      type="file"
                      accept="image/*"
                      onChange={e => setProfileImage(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                  </div>
                  {signupError && <div className="text-red-500 text-sm">{signupError}</div>}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : 'Sign Up'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a verification code to {otpEmail}. Please enter it below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp-code" className="block text-sm font-medium mb-2">Verification Code</label>
              <Input
                id="otp-code"
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full"
                maxLength={6}
                required
              />
            </div>
            {otpError && <div className="text-red-500 text-sm">{otpError}</div>}
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                className="w-full sm:w-auto"
              >
                {resendOtpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : 'Resend Code'}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600"
                disabled={verifyEmailMutation.isPending}
              >
                {verifyEmailMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : 'Verify Email'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forget Password Dialog */}
      <Dialog open={showForgetPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setForgetPasswordStep('email');
          setForgetOtpCode('');
          setCountdown(0);
          setForgetPasswordError('');
        }
        setShowForgetPasswordDialog(open);
      }}>
        <DialogContent className="sm:max-w-md">
          {forgetPasswordStep === 'email' && (
            <>
              <DialogHeader>
                <DialogTitle>Forget Password</DialogTitle>
                <DialogDescription>
                  Enter your email to receive a verification code.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendForgetOtp} className="space-y-4">
                <div>
                  <label htmlFor="forget-email" className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    id="forget-email"
                    type="email"
                    value={forgetPasswordEmail}
                    onChange={e => setForgetPasswordEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full"
                    required
                  />
                </div>
                {forgetPasswordError && <div className="text-red-500 text-sm">{forgetPasswordError}</div>}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgetPasswordDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600"
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : 'Send OTP'}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}

          {forgetPasswordStep === 'otp' && (
            <>
              <DialogHeader>
                <DialogTitle>Enter OTP</DialogTitle>
                <DialogDescription>
                  We've sent a verification code to {forgetPasswordEmail}. Please enter it below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleVerifyForgetOtp} className="space-y-4">
                <div>
                  <label htmlFor="forget-otp" className="block text-sm font-medium mb-2">Verification Code</label>
                  <Input
                    id="forget-otp"
                    type="text"
                    value={forgetOtpCode}
                    onChange={e => setForgetOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full"
                    maxLength={6}
                    required
                  />
                </div>
                {countdown > 0 && (
                  <p className="text-sm text-gray-500">Resend available in {countdown}s</p>
                )}
                {forgetPasswordError && <div className="text-red-500 text-sm">{forgetPasswordError}</div>}
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={countdown > 0 || sendOtpMutation.isPending}
                    onClick={() => {
                      sendOtpMutation.mutate(
                        { email: forgetPasswordEmail, type: 'ForgetPassword' },
                        {
                          onSuccess: (data) => {
                            if (data.status === 0) {
                              setCountdown(30);
                              setForgetPasswordError('');
                            } else {
                              setForgetPasswordError(data.message || 'Failed to resend OTP');
                            }
                          },
                          onError: () => {
                            setForgetPasswordError('Failed to resend OTP');
                          }
                        }
                      );
                    }}
                    className="w-full sm:w-auto"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : sendOtpMutation.isPending ? 'Sending...' : 'Resend'}
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600"
                    disabled={verifyEmailMutation.isPending}
                  >
                    {verifyEmailMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : 'Verify OTP'}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}

          {forgetPasswordStep === 'reset' && (
            <>
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  Enter your new password for {forgetPasswordEmail}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="forget-new-password" className="block text-sm font-medium mb-2">New Password</label>
                  <Input
                    id="forget-new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                    required
                  />
                </div>
                {forgetPasswordError && <div className="text-red-500 text-sm">{forgetPasswordError}</div>}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForgetPasswordStep('email');
                      setForgetOtpCode('');
                      setCountdown(0);
                      setShowForgetPasswordDialog(false);
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600"
                    disabled={forgetPasswordMutation.isPending}
                  >
                    {forgetPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : 'Reset Password'}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LoginView
