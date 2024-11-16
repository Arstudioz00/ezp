"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from "@/app/(protected)/components/sidebar";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        {children}
      </main>
    </div>
  );
} 