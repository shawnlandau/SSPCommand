"use client";
import { ReactNode, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "@/lib/firebase";
import Link from "next/link";

export function AuthGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading…</div>;
  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Sign in required</h1>
          <p className="text-gray-600">Please check your email for a magic link or request access.</p>
          <Link className="text-blue-600 underline" href="/signin">Go to sign in</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}



