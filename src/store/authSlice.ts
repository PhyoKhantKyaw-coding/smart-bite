import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  userId?: string;
  email?: string;
  role: 'user' | 'admin' | 'delivery';
  userProfile?: string;
  userName?: string;
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;