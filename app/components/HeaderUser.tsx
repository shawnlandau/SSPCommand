"use client";
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "@/lib/firebase";

export function HeaderUser() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setEmail(u?.email ?? null));
  }, []);
  return <div className="ml-auto text-sm text-gray-600">{email ?? ""}</div>;
}



