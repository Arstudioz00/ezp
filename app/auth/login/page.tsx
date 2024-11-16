"use client";

import { AuthForm } from '@/components/auth-form';
import { AuthLayout } from '@/components/auth-layout';

export default function LoginPage() {
  return (
    <AuthLayout title="Sign in to your account">
      <AuthForm />
    </AuthLayout>
  );
}