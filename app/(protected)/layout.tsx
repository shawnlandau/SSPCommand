import { ReactNode } from 'react';
import Link from 'next/link';
import { HeaderUser } from '@/app/components/HeaderUser';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/opportunities/" className="text-foreground hover:text-primary transition-colors">
              Opportunities
            </Link>
          </nav>
          <HeaderUser />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}


