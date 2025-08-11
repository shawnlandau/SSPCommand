"use client";
import { useEffect, useState } from "react";
import { auth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "@/lib/firebase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Complete sign-in if returning via email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const stored = window.localStorage.getItem("emailForSignIn") || "";
      if (stored) {
        signInWithEmailLink(auth, stored, window.location.href)
          .then(() => {
            window.localStorage.removeItem("emailForSignIn");
            window.location.replace("/");
          })
          .catch((e) => setError(e.message));
      }
    }
  }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const actionCodeSettings = {
        url: window.location.origin + "/signin",
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={sendMagicLink} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-gray-600">Use your email to receive a magic link.</p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full border rounded px-3 py-2"
        />
        <button className="w-full bg-blue-600 text-white rounded px-3 py-2">Send magic link</button>
        {sent && <p className="text-green-600 text-sm">Check your inbox for the sign-in link.</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}


