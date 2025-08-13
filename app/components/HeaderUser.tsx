"use client";
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "@/lib/firebase";
import { User } from "lucide-react";

export function HeaderUser() {
  const [email, setEmail] = useState<string | null>(null);
  
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setEmail(u?.email ?? null));
  }, []);
  
  return (
    <div className="flex items-center gap-3 ml-auto">
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-xl">
        <User className="w-4 h-4 text-foreground-muted" />
        <span className="text-body-sm text-foreground font-medium">
          {email ?? "Guest"}
        </span>
      </div>
    </div>
  );
}



