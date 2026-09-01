'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { AuthUser, StoredUser } from '@/lib/types';
import { readStorage, writeStorage, removeStorage, ensureSeed } from '@/lib/storage';
import { ADMIN_DEMO, STORAGE_KEYS } from '@/lib/constants';
import { createBrowserSupabase, hasSupabaseEnv } from '@/lib/supabase';
import type { Provider } from '@supabase/supabase-js';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** 'supabase' nếu có env, 'local' nếu đang fallback */
  mode: 'supabase' | 'local';
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  signup: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ ok: boolean; error?: string }>;
  loginWithProvider: (
    provider: 'google' | 'github'
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

// ---------- localStorage helpers (fallback) ----------

function listUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(STORAGE_KEYS.users, () => [ADMIN_DEMO], [ADMIN_DEMO]);
}

function readSession(): AuthUser | null {
  return readStorage<AuthUser | null>(STORAGE_KEYS.session, () => null, null);
}

function writeSession(user: AuthUser | null) {
  if (user) writeStorage(STORAGE_KEYS.session, user);
  else removeStorage(STORAGE_KEYS.session);
}

function mapSupabaseUser(u: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
  created_at?: string;
}): AuthUser {
  const meta = u.user_metadata ?? {};
  const fullName =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.user_name as string) ||
    (u.email?.split('@')[0] ?? 'User');
  return {
    id: u.id,
    email: u.email ?? '',
    fullName,
    role: (meta.role as 'admin' | 'user') || 'user',
    createdAt: u.created_at ?? new Date().toISOString(),
  };
}

// ---------- Context ----------

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // mode chỉ dùng cho login/signup/logout logic, KHÔNG block đọc session ban đầu
  const [mode, setMode] = useState<'supabase' | 'local'>(() =>
    hasSupabaseEnv() ? 'supabase' : 'local'
  );

  useEffect(() => {
    let cancelled = false;

    // Luôn thử Supabase trước (chạy song song với local fallback)
    const supabase = createBrowserSupabase();

    async function loadSession() {
      if (!supabase) {
        // Đảm bảo seed admin luôn có mặt
        ensureSeed<StoredUser>(STORAGE_KEYS.users, ADMIN_DEMO);
        if (!cancelled) {
          setMode('local');
          setUser(readSession());
          setLoading(false);
        }
        return;
      }

      // 1. getSession — lấy session hiện tại (OAuth callback set ở đây)
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionData.session?.user) {
        setMode('supabase');
        setUser(mapSupabaseUser(sessionData.session.user));
        setLoading(false);
      } else {
        // 2. Thử localStorage fallback
        ensureSeed<StoredUser>(STORAGE_KEYS.users, ADMIN_DEMO);
        const localUser = readSession();
        if (localUser) {
          setMode('local');
          setUser(localUser);
        } else {
          setMode('supabase');
          setUser(null);
        }
        setLoading(false);
      }
    }

    loadSession();

    if (!supabase) return;

    // 3. Listen cho auth events (OAuth callback, signOut, v.v.)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setMode('supabase');
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback<AuthContextValue['login']>(
    async (email, password) => {
      if (mode === 'supabase') {
        const supabase = createBrowserSupabase();
        if (!supabase) return { ok: false, error: 'Supabase chưa sẵn sàng.' };
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };
        const u = mapSupabaseUser(data.user);
        return { ok: true, user: u };
      }
      // localStorage fallback
      await new Promise((r) => setTimeout(r, 400));
      const users = listUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        return { ok: false, error: 'Email hoặc mật khẩu không đúng.' };
      }
      const session: AuthUser = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
        role: found.role,
        createdAt: found.createdAt,
      };
      writeSession(session);
      setUser(session);
      return { ok: true, user: session };
    },
    [mode]
  );

  const signup = useCallback<AuthContextValue['signup']>(
    async (email, password, fullName) => {
      if (mode === 'supabase') {
        const supabase = createBrowserSupabase();
        if (!supabase) return { ok: false, error: 'Supabase chưa sẵn sàng.' };
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      }
      // localStorage fallback
      await new Promise((r) => setTimeout(r, 400));
      const users = listUsers();
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { ok: false, error: 'Email đã được sử dụng.' };
      }
      const newUser: StoredUser = {
        id: `usr_${Date.now().toString(36)}`,
        email,
        password,
        fullName: fullName || email.split('@')[0],
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      writeStorage(STORAGE_KEYS.users, [...users, newUser]);
      const session: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };
      writeSession(session);
      setUser(session);
      return { ok: true };
    },
    [mode]
  );

  const loginWithProvider = useCallback<AuthContextValue['loginWithProvider']>(
    async (provider) => {
      if (mode !== 'supabase') {
        return {
          ok: false,
          error:
            'OAuth chưa khả dụng. Hãy cấu hình Supabase trong .env.local theo hướng dẫn.',
        };
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return { ok: false, error: 'Supabase chưa sẵn sàng.' };
      // Ưu tiên window.location.origin (đúng với port thực tế user đang dùng),
      // fallback về NEXT_PUBLIC_APP_URL khi chạy SSR hoặc build tĩnh.
      const appUrl =
        (typeof window !== 'undefined' && window.location.origin) ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000';
      const callbackUrl = `${appUrl}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [mode]
  );

  const logout = useCallback(async () => {
    if (mode === 'supabase') {
      const supabase = createBrowserSupabase();
      if (supabase) await supabase.auth.signOut();
    }
    writeSession(null);
    setUser(null);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/';
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }, [mode]);

  const value: AuthContextValue = {
    user,
    loading,
    mode,
    login,
    signup,
    loginWithProvider,
    logout,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
