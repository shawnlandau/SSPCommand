import { ReactNode } from "react";
import { AuthGate } from "@/app/components/AuthGate";
import { HeaderUser } from "@/app/components/HeaderUser";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-foreground">
                SSP Command Center
              </h1>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <a href="/" className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted transition-colors">
                  Dashboard
                </a>
                <a href="/opportunities" className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors">
                  Opportunities
                </a>
                <a href="/signals" className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors">
                  Signals
                </a>
                <a href="/cosell" className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors">
                  Co-sell
                </a>
                <a href="/simulator" className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors">
                  Simulator
                </a>
              </nav>
            </div>
            
            {/* User Menu */}
            <HeaderUser />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthGate>
  );
}


