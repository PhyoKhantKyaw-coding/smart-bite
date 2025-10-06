import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';

// Login mutation
export const loginUser = {
	useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<LoginResponseDTO>, Error, LoginDTO>>) => {
		return useMutation<ResponseDTO<LoginResponseDTO>, Error, LoginDTO>({
			mutationFn: async (credentials) => {
				const request = await axios.post(`User/login`, credentials);
				return request.data;
			},
			...opt
		});
	}
};

// Google login mutation
export const googleLogin = {
	useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<LoginResponseDTO>, Error, string>>) => {
		return useMutation<ResponseDTO<LoginResponseDTO>, Error, string>({
			mutationFn: async (idToken) => {
				const request = await axios.post(`User/google-login`, null, {
					params: { idToken }
				});
				return request.data;
			},
			...opt
		});
	}
};

// Signup/Register mutation
export const registerUser = {
	useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<LoginResponseDTO>, Error, FormData>>) => {
		return useMutation<ResponseDTO<LoginResponseDTO>, Error, FormData>({
			mutationFn: async (userData) => {
				const request = await axios.post(`User/add`, userData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});
				return request.data;
			},
			...opt
		});
	}
};

// Verify Email OTP mutation
export const verifyEmail = {
	useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<boolean>, Error, { email: string; otp: string }>>) => {
		return useMutation<ResponseDTO<boolean>, Error, { email: string; otp: string }>({
			mutationFn: async ({ email, otp }) => {
				const request = await axios.post(`User/VerifyEmail`, null, {
					params: { email, otp }
				});
				return request.data;
			},
			...opt
		});
	}
};

// Reset/Resend OTP mutation
export const resetOTP = {
	useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<boolean>, Error, string>>) => {
		return useMutation<ResponseDTO<boolean>, Error, string>({
			mutationFn: async (email) => {
				const request = await axios.post(`User/ResetOTP`, null, {
					params: { email }
				});
				return request.data;
			},
			...opt
		});
	}
};

// Forget Password mutation
export const forgetPassword = {
	useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<boolean>, Error, { email: string; newPassword: string }>>) => {
		return useMutation<ResponseDTO<boolean>, Error, { email: string; newPassword: string }>({
			mutationFn: async ({ email, newPassword }) => {
				const request = await axios.post(`User/forget-password`, null, {
					params: { email, newPassword }
				});
				return request.data;
			},
			...opt
		});
	}
};
