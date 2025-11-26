'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });

export default function Header() {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">KESL</h1>
          <div>
            {user ? (
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}