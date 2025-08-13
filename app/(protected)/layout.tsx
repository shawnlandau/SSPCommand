import { ReactNode } from 'react';
import Link from 'next/link';
import { HeaderUser } from '@/app/components/HeaderUser';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex gap-8">
            <Link 
              href="/" 
              className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              href="/opportunities/" 
              className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200"
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


