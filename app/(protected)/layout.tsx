import { ReactNode } from 'react';
import Link from 'next/link';
import { HeaderUser } from '@/app/components/HeaderUser';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 shadow-soft">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Navigation */}
            <nav className="flex flex-wrap gap-8">
              <Link 
                href="/" 
                className="nav-link text-2xl font-semibold hover:text-accent-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/opportunities/" 
                className="nav-link text-2xl font-semibold hover:text-accent-600 transition-colors duration-200"
              >
                Opportunities
              </Link>
            </nav>
            
            {/* User Section */}
            <div className="flex items-center">
              <HeaderUser />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}


