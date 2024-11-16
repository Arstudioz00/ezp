"use client";

import { AuthForm } from '@/components/auth-form';
import { AuthLayout } from '@/components/auth-layout';

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account">
      <AuthForm />
    </AuthLayout>
  );
}