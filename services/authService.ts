import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { addUser, getUserByEmail } from './databaseService';

// For platforms that don't support SecureStore (like web)
const secureStoreOrAsync = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  }
};

// Auth state storage keys
const AUTH_TOKEN = 'auth_token';
const USER_ID = 'user_id';
const USER_DATA = 'user_data';

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return { 
        success: false, 
        error: 'User with this email already exists' 
      };
    }

    // In a real app, we would hash the password here
    const userId = await addUser({
      email: data.email,
      password: data.password,
      name: data.name
    });

    if (!userId) {
      return { 
        success: false, 
        error: 'Failed to create user account' 
      };
    }

    // Create auth user object
    const authUser: AuthUser = {
      id: userId,
      email: data.email,
      name: data.name
    };

    // Save auth state
    await secureStoreOrAsync.setItem(AUTH_TOKEN, `user_token_${userId}`);
    await secureStoreOrAsync.setItem(USER_ID, userId.toString());
    await AsyncStorage.setItem(USER_DATA, JSON.stringify(authUser));

    return {
      success: true,
      user: authUser
    };
  } catch (error) {
    console.error('[Auth] Registration error:', error);
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    };
  }
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Get user from database
    const user = await getUserByEmail(credentials.email);
    
    // Check if user exists and password matches
    if (!user || user.password !== credentials.password) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Create auth user object
    const authUser: AuthUser = {
      id: user.id as number,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage
    };

    // Save auth state
    await secureStoreOrAsync.setItem(AUTH_TOKEN, `user_token_${user.id}`);
    await secureStoreOrAsync.setItem(USER_ID, user.id?.toString() || '');
    await AsyncStorage.setItem(USER_DATA, JSON.stringify(authUser));

    return {
      success: true,
      user: authUser
    };
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return {
      success: false,
      error: 'Login failed. Please try again.'
    };
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await secureStoreOrAsync.deleteItem(AUTH_TOKEN);
    await secureStoreOrAsync.deleteItem(USER_ID);
    await AsyncStorage.removeItem(USER_DATA);
  } catch (error) {
    console.error('[Auth] Logout error:', error);
  }
};

// Check if user is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await secureStoreOrAsync.getItem(AUTH_TOKEN);
    return !!token;
  } catch (error) {
    console.error('[Auth] Auth check error:', error);
    return false;
  }
};

// Get current user data
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA);
    if (!userData) return null;
    
    return JSON.parse(userData) as AuthUser;
  } catch (error) {
    console.error('[Auth] Get current user error:', error);
    return null;
  }
};

// Get current user ID
export const getCurrentUserId = async (): Promise<number | null> => {
  try {
    const userId = await secureStoreOrAsync.getItem(USER_ID);
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error('[Auth] Get user ID error:', error);
    return null;
  }
}; 