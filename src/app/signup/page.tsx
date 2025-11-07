'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { setDocumentMeta } from '@/lib/seo';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export default function Signup() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setDocumentMeta({
      title: 'Sign Up - AURA',
      description: 'Create your AURA account and start your personalized career journey.',
    });
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      router.push('/app/dashboard');
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      // Validate input
      const validation = signupSchema.safeParse({ email, password });
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast({
          variant: 'destructive',
          title: 'Invalid input',
          description: firstError.message,
        });
        return;
      }

      const { error } = await signUp({ email, password });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Signup failed',
          description: error.message,
        });
        return;
      }

      // Show confirmation screen
      setShowConfirmation(true);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: 'Something went wrong while creating your account. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-block text-2xl font-semibold text-foreground hover:text-accent transition-colors mb-4"
            >
              AURA
            </Link>
          </div>

          <div className="p-8 rounded-xl border border-border bg-card space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-accent" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Check your email
              </h1>
              <p className="text-muted-foreground">
                We&apos;ve sent you a confirmation link. Please check your email and click the link to verify your account.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Go to login
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-2xl font-semibold text-foreground hover:text-accent transition-colors mb-4"
          >
            AURA
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Get started</h1>
          <p className="text-muted-foreground">
            Create your account to begin your career journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="p-8 rounded-xl border border-border bg-card space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-accent hover:text-accent/80 underline underline-offset-2"
            >
              Log in
            </Link>
          </p>

          <p className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}