"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "./env";
import type { AuthSession } from "./types";

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  stub: boolean;
  refreshSession: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STUB_SESSION: AuthSession = {
  accessToken: "local-stub-access-token",
  userId: "local-stub-user",
  email: "paciente.demo@clinic.local",
  stub: true,
};

function createSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stub = !isSupabaseConfigured();
  const client = useMemo(() => createSupabase(), []);
  const [session, setSession] = useState<AuthSession | null>(stub ? STUB_SESSION : null);
  const [loading, setLoading] = useState(!stub);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;

    const apply = (accessToken?: string, userId?: string, email?: string) => {
      if (cancelled) return;
      if (accessToken && userId) {
        setSession({
          accessToken,
          userId,
          email: email ?? "",
          stub: false,
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    };

    client.auth.getSession().then(({ data }) => {
      apply(
        data.session?.access_token,
        data.session?.user.id,
        data.session?.user.email,
      );
    });

    const { data } = client.auth.onAuthStateChange((_event, next) => {
      apply(next?.access_token, next?.user.id, next?.user.email);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [client]);

  const refreshSession = async () => {
    if (!client) return session?.accessToken ?? null;
    const { data } = await client.auth.refreshSession();
    const next = data.session;
    if (next?.access_token && next.user.id) {
      const updated = {
        accessToken: next.access_token,
        userId: next.user.id,
        email: next.user.email ?? "",
        stub: false,
      };
      setSession(updated);
      return updated.accessToken;
    }
    return session?.accessToken ?? null;
  };

  return (
    <AuthContext.Provider value={{ session, loading, stub, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
