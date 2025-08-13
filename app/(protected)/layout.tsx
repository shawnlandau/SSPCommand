import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderUser } from '@/app/components/HeaderUser';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-neutral-100 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex gap-8">
            <Link 
              href="/" 
              className="text-section text-foreground hover:text-accent-600 transition-colors duration-200 font-semibold"
            >
              Dashboard
            </Link>
            <Link 
              href="/opportunities/" 
              className="text-section text-foreground hover:text-accent-600 transition-colors duration-200 font-semibold"
            >
              Opportunities
            </Link>
          </nav>
          <div className="mt-4">
            <HeaderUser />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}


