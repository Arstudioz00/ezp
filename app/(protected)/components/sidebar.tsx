"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Settings,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/hooks/use-auth';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-sky-500',
    },
    {
      label: 'Customers',
      icon: Users,
      href: '/customers',
      color: 'text-violet-500',
    },
    {
      label: 'Projects',
      icon: Briefcase,
      href: '/projects',
      color: 'text-pink-700',
    },
    {
      label: 'Invoices',
      icon: FileText,
      href: '/invoices',
      color: 'text-orange-700',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-secondary/50">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">InvoiceHub</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                pathname === route.href ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full justify-start"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="ml-4">Toggle theme</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}