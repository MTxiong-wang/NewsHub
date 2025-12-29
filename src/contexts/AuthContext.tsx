import { createContext, useContext, useState, type ReactNode } from 'react';

// 简化的用户类型
export interface User {
  id: string;
  username: string;
}

// 简化的 Profile 类型
export interface Profile {
  id: string;
  username: string;
  preferences?: Record<string, any>;
}

// 模拟的 getProfile 函数（本地存储）
export async function getProfile(userId: string): Promise<Profile | null> {
  const stored = localStorage.getItem(`profile_${userId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  // 本地模拟登录
  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      // 简单的本地验证（实际生产环境应该使用真实的认证服务）
      if (!username || !password) {
        throw new Error('用户名和密码不能为空');
      }

      // 创建模拟用户
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username,
      };

      // 存储到 localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));

      setUser(mockUser);

      // 创建默认 profile
      const mockProfile: Profile = {
        id: mockUser.id,
        username: mockUser.username,
        preferences: {},
      };

      localStorage.setItem(`profile_${mockUser.id}`, JSON.stringify(mockProfile));
      setProfile(mockProfile);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // 本地模拟注册
  const signUp = async (username: string, password: string) => {
    try {
      setLoading(true);
      if (!username || !password) {
        throw new Error('用户名和密码不能为空');
      }

      // 注册和登录使用相同的逻辑（本地模式）
      return signIn(username, password);
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
