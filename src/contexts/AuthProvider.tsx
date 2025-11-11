'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { getSupabaseClient } from '@/integrations/supabase/client'
import type {
  Session,
  User,
  AuthError,
  SupabaseClient,
} from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: User | null
  signUp: (params: {
    email: string
    password: string
  }) => Promise<{ error: AuthError | null }>
  signInWithPassword: (params: {
    email: string
    password: string
  }) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithApple: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo<SupabaseClient | null>(() => getSupabaseClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!supabase) {
      return
    }
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const missingClientError = async () => ({
    error: {
      name: 'AuthError',
      message:
        'Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    } as AuthError,
  })

  const value: AuthContextType = supabase
    ? {
        session,
        user,
        signUp: async ({ email, password }) => {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          return { error }
        },
        signInWithPassword: async ({ email, password }) => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          return { error }
        },
        signInWithGoogle: async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          })
          return { error }
        },
        signInWithApple: async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          return { error }
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut()
          return { error }
        },
      }
    : {
        session: null,
        user: null,
        signUp: missingClientError,
        signInWithPassword: missingClientError,
        signInWithGoogle: missingClientError,
        signInWithApple: missingClientError,
        signOut: missingClientError,
      }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
