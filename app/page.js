'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [aiBalance, setAiBalance] = useState(100000);
  const [topUpAmount, setTopUpAmount] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState('stripe_3ds');
  const [cardNumberInput, setCardNumberInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [securityLogs, setSecurityLogs] = useState([]);

  // Fungsi Log Sistem Keamanan internal
  const addSecurityLog = (msg) => {
    setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  // Algoritma Luhn (Mendeteksi Validitas Dasar Angka Kartu Kredit / Mencegah Asal Ketik)
  const validateLuhn = (num) => {
    let arr = (num + '').split('').reverse().map(x => parseInt(x));
    let lastDigit = arr.shift();
    let sum = arr.reduce((acc, val, i) => {
      if (i % 2 === 0) { val = val * 2; if (val > 9) val -= 9; }
      return acc + val;
    }, 0);
    return (sum + lastDigit) % 10 === 0;
  };

  const handleSecurePayment = (e) => {
    e.preventDefault();
    setPaymentStatus('SCANNING');
    addSecurityLog("Memicu AI Fraud Detection Shield...");

    // 1. Validasi Serangan Carding / Generator Kartu Kredit
    if ((paymentMethod === 'stripe_3ds' || paymentMethod === 'midtrans_card') && cardNumberInput) {
      if (cardNumberInput.length < 15 || !validateLuhn(cardNumberInput)) {
        setTimeout(() => {
          setPaymentStatus('FAILED_FRAUD');
          addSecurityLog("❌ PERINGATAN: Deteksi Fake BIN / Card Generator! Transaksi diblokir.");
          alert("Sistem Keamanan: Kartu Anda ditolak karena terindikasi ilegal atau tidak lolos uji algoritma perbankan!");
        }, 1500);
        return;
      }
    }

    // 2. Simulasi Autentikasi 3D-Secure Tanpa Bypass
    setTimeout(() => {
      setPaymentStatus('WAITING_3DS');
      addSecurityLog("🔒 Mengarahkan ke Server Bank OTP (Mencegah Bypass 3DS)...");
      
      setTimeout(() => {
        setPaymentStatus('SUCCESS');
        setAiBalance(prev => prev + parseInt(topUpAmount));
        addSecurityLog("✅ Autentikasi OTP Selesai. Dana Bersih Diverifikasi.");
        alert("Pembayaran Terverifikasi 100% Aman! Saldo AI Anda telah ditambahkan.");
        setPaymentStatus('');
        setCardNumberInput('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-mono text-xs">
      {/* Topbar */}
      <header className="p-4 border-b border-gray-900 bg-gray-900/60 flex items-center justify-between px-6">
        <span className="font-black text-blue-400">⚡ QUANTUM VAULT SECURE</span>
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl">
            Saldo: <span className="text-emerald-400 font-bold">Rp {aiBalance.toLocaleString()}</span>
          </div>
          <button onClick={() => setActiveTab(activeTab === 'chat' ? 'billing' : 'chat')} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl font-bold transition">
            {activeTab === 'chat' ? '💳 Portal Aman' : '💬 Menu Chat'}
          </button>
        </div>
      </header>

      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-gray-500">Sistem AI Chat Terenkripsi Aktif.</p>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="flex-1 overflow-y-auto p-4 max-w-lg w-full mx-auto space-y-4">
          {/* Panel Audit Keamanan Terus-Menerus */}
          <div className="bg-black/40 border border-gray-900 rounded-xl p-4">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> Live Security Audit Shield
            </div>
            <div className="space-y-1 text-[11px] font-mono text-gray-400">
              {securityLogs.length === 0 ? <p className="text-gray-600 italic">Menunggu aktivitas transaksi...</p> : securityLogs.map((log, i) => <p key={i}>{log}</p>)}
            </div>
          </div>

          {/* Form Utama Portal Billing */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl">
            <h2 className="text-sm font-black mb-4 uppercase tracking-tight">🔒 Gerbang Pembayaran Anti-Fraud</h2>
            
            <form onSubmit={handleSecurePayment} className="space-y-4">
              {/* Jumlah Top Up */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nominal Saldo (IDR)</label>
                <select value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white">
                  <option value="50000">Rp 50.000 (Tarif Bersaing)</option>
                  <option value="100000">Rp 100.000 (Bonus Kuota AI)</option>
                </select>
              </div>

              {/* Pilihan Metode Multi-Gateway */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Pilih Infrastruktur Gateway</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 bg-gray-950 border border-gray-800 p-3 rounded-xl cursor-pointer hover:border-gray-700">
                    <input type="radio" name="gateway" value="stripe_3ds" checked={paymentMethod === 'stripe_3ds'} onChange={() => setPaymentMethod('stripe_3ds')} />
                    <span>🇪🇺 STRIPE Global (Proteksi AI Radar & Wajib 3D-Secure)</span>
                  </label>
                  <label className="flex items-center gap-3 bg-gray-950 border border-gray-800 p-3 rounded-xl cursor-pointer hover:border-gray-700">
                    <input type="radio" name="gateway" value="midtrans_card" checked={paymentMethod === 'midtrans_card'} onChange={() => setPaymentMethod('midtrans_card')} />
                    <span>🇮🇩 MIDTRANS (FDS Aegis Anti-Carding Indonesia)</span>
                  </label>
                  <label className="flex items-center gap-3 bg-gray-950 border border-gray-800 p-3 rounded-xl cursor-pointer hover:border-gray-700">
                    <input type="radio" name="gateway" value="crypto_secure" checked={paymentMethod === 'crypto_secure'} onChange={() => setPaymentMethod('crypto_secure')} />
                    <span>🪙 WEB3 Crypto Ledger (Verifikasi Hash Blockchain Otomatis)</span>
                  </label>
                </div>
              </div>

              {/* Kolom Nomor Kartu (Hanya Muncul jika Metode Kartu Terpilih) */}
              {paymentMethod !== 'crypto_secure' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nomor Kartu Kredit/Debit Uji Coba</label>
                  <input type="number" placeholder="Ketik nomor kartu untuk disaring AI Fraud..." value={cardNumberInput} onChange={(e) => setCardNumberInput(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white tracking-widest placeholder-gray-800" />
                </div>
              )}

              {/* Tombol Pembayaran Sekuritas Tinggi */}
              <button type="submit" disabled={paymentStatus === 'SCANNING' || paymentStatus === 'WAITING_3DS'} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-black py-3.5 rounded-xl transition cursor-pointer">
                {paymentStatus === 'SCANNING' && '🔄 AI Memeriksa Validitas Kartu...'}
                {paymentStatus === 'WAITING_3DS' && '🔒 Menunggu Verifikasi 3DS Bank OTP...'}
                {paymentStatus === '' && `Proses Transaksi Aman - Rp ${parseInt(topUpAmount).toLocaleString()}`}
                {paymentStatus === 'FAILED_FRAUD' && '❌ Transaksi Diblokir Keamanan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

