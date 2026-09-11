'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    const checkEnvironmentIntegrity = () => {
      const isDebuggerOpen = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160;
      if (isDebuggerOpen) setIsSecure(false);
    };
    const timer = setTimeout(() => setShowSplash(false), 1500);
    const interval = setInterval(checkEnvironmentIntegrity, 1500);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (showSplash) {
    return (
      <html lang="id">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
          <script src="https://jsdelivr.net"></script>
        </head>
        <body className="bg-black flex flex-col items-center justify-center h-screen font-mono text-white select-none">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-xs font-black text-blue-400 tracking-widest uppercase">QUANTUM VAULT OS</h1>
        </body>
      </html>
    );
  }

  if (!isSecure) {
    return (
      <html lang="id">
        <body className="bg-black text-red-500 flex flex-col items-center justify-center h-screen font-mono text-center p-4">
          <h1 className="text-xs font-black">SECURITY EXCEPTION</h1>
          <p className="text-[10px] text-gray-500 mt-2">Sistem RASP mengunci aplikasi dari debugger luar.</p>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="id">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
          <script src="https://jsdelivr.net"></script>
        </head>
        <body className="bg-gray-950 text-white font-sans m-0 p-0 overscroll-none">{children}</body>
      </html>
    </ClerkProvider>
  );
}
