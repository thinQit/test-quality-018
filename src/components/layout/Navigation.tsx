'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-foreground" aria-label="Go to homepage">
          test-quality-018
        </Link>
        <button
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} aria-label="Log out">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" aria-label="Login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup" aria-label="Sign up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <div className="space-y-1 border-t border-border px-4 py-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              aria-label="Log out"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm font-medium text-foreground" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium text-foreground" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
