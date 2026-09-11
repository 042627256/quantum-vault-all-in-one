'use client';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next';
import { useState, useEffect } from 'react';

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-black tracking-widest text-blue-400 uppercase">Quantum Core</h1>
      <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">SCANNING DEVICE INTEGRITY...</p>
    </div>
  );
}

export default function RootLayout({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [deviceSafe, setDeviceSafe] = useState(true);

  // Simulasi pemindaian virus sederhana / Bot di browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isBot = /bot|googlebot|crawler|spider/i.test(navigator.userAgent);
      if (isBot) {
        setDeviceSafe(false);
      }
    }
  }, []);

  if (showSplash) {
    return (
      <html lang="id">
        <head><script src="https://jsdelivr.net"></script></head>
        <body>
          <SplashScreen onFinish={() => setShowSplash(false)} />
          <Analytics />
        </body>
      </html>
    );
  }

  if (!deviceSafe) {
    return (
      <html lang="id">
        <body className="bg-black text-red-500 flex flex-col items-center justify-center h-screen font-mono text-center px-4">
          <h1 className="text-2xl font-bold">AKSES DITOLAK (DETEKSI ANOMALI)</h1>
          <p className="text-xs text-gray-400 mt-2">Sistem mendeteksi aktivitas otomatis (Bot) atau lingkungan perangkat yang tidak aman.</p>
          <Analytics />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="id">
        <head><script src="https://jsdelivr.net"></script></head>
        <body className="bg-gray-950 text-white m-0 p-0 antialiased font-sans">
          <SignedOut>
            <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-radial from-gray-900 to-gray-950">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl mb-4 animate-pulse">🔒</div>
              <h1 className="text-2xl font-black tracking-tight mb-1">Secure Core Gateway</h1>
              <p className="text-xs text-gray-400 max-w-xs mb-6">Otorisasi berlapis 3D-Secure & Anti-Fraud aktif secara real-time.</p>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-500 font-bold px-8 py-3.5 rounded-xl w-full max-w-sm shadow-md transition active:scale-95 text-sm cursor-pointer">
                  Masuk dengan SSO Terverifikasi
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="fixed top-4 right-4 z-50"><UserButton afterSignOutUrl="/" /></div>
            {children}
          </SignedIn>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
