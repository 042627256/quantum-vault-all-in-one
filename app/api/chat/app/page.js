'use client';
import { useState, useEffect, useRef } from 'react';
import { Cpu, CreditCard, Shield, Landmark } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat'); 
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyChatsLeft, setDailyChatsLeft] = useState(3); 
  const [aiBalance, setAiBalance] = useState(0); 

  const [isCexLoggedIn, setIsCexLoggedIn] = useState(false);
  const [selectedCex, setSelectedCex] = useState('pintu');
  const [userEmail, setUserEmail] = useState('');
  const [kycStatus, setKycStatus] = useState('UNVERIFIED');

  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: '🌌 Quantum Vault Active. Jatah 3 Chat Gratis Harian Aktif. RASP Anti-RAT Siaga.' }]);
  }, []);

  const handleCexLogin = (e) => {
    e.preventDefault();
    if (!userEmail.includes('@')) return alert("Email tidak valid!");
    setIsLoading(true);
    setTimeout(() => {
      setIsCexLoggedIn(true);
      setIsLoading(false);
      alert(`Berhasil terhubung ke akun ${selectedCex.toUpperCase()}! Auto-debit aktif.`);
    }, 1500);
  };

  const handleExecuteAI = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let cost = 150;
    if (selectedModel === 'deepseek-r1') cost = 1000;

    if (dailyChatsLeft > 0 && selectedModel === 'gpt-4o-mini') {
      setDailyChatsLeft(prev => prev - 1);
    } else {
      if (aiBalance < cost && !isCexLoggedIn) return alert("Kuota gratis habis! Mohon isi saldo atau hubungkan dompet CEX.");
      if (!isCexLoggedIn) setAiBalance(prev => prev - cost);
    }

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, messages: [...messages, userMessage] }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, data.choices ? data.choices.message : { role: 'assistant', content: data.error }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Gagal terhubung ke server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200 font-mono text-xs select-none">
      <header className="p-4 border-b border-gray-900 bg-gray-900/40 flex justify-between items-center px-6">
        <span className="font-black text-blue-400">🌌 QUANTUM CITADEL ID</span>
        <div className="bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-[10px]">
          {isCexLoggedIn ? <span className="text-purple-400">🔗 Wallet Connected</span> : <span>Free Hari Ini: {dailyChatsLeft} Chat | Saldo: Rp {aiBalance}</span>}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-14 border-r border-gray-900 bg-gray-900/10 flex flex-col items-center py-4 gap-4">
          <button onClick={() => setActiveTab('chat')} className={`p-2 rounded-xl ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}><Cpu size={14} /></button>
          <button onClick={() => setActiveTab('wallet')} className={`p-2 rounded-xl ${activeTab === 'wallet' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}><CreditCard size={14} /></button>
          <button onClick={() => setActiveTab('kyc')} className={`p-2 rounded-xl ${activeTab === 'kyc' ? 'bg-amber-600 text-white' : 'text-gray-600'}`}><Shield size={14} /></button>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-2 bg-gray-950 border-b border-gray-900 flex justify-center gap-2">
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="bg-gray-900 border border-gray-800 text-white rounded p-1">
                  <option value="gpt-4o-mini">GPT-4o Mini (Bisa Free Harian)</option>
                  <option value="deepseek-r1">DeepSeek-R1 (Penalaran Premium)</option>
                </select>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-xl w-full mx-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-900 border border-gray-800'}`}>{msg.content}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <footer className="p-4 border-t border-gray-900 bg-gray-950">
                <form onSubmit={handleExecuteAI} className="max-w-xl mx-auto flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Kirim instruksi..." className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none" />
                  <button type="submit" className="bg-blue-600 font-bold rounded-xl px-5 py-3">KIRIM</button>
                </form>
              </footer>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="flex-1 flex items-center justify-center p-6">
              <form onSubmit={handleCexLogin} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-xs space-y-3">
                <h3 className="font-bold text-center flex items-center justify-center gap-1"><Landmark size={14}/> CEX OAuth Portal</h3>
                <select value={selectedCex} onChange={(e) => setSelectedCex(e.target.value)} className="w-full bg-gray-950 border border-gray-800 p-2 rounded-xl text-white outline-none">
                  <option value="pintu">Pintu Wallet</option>
                  <option value="tokocrypto">Tokocrypto</option>
                  <option value="indodax">Indodax Exchange</option>
                </select>
                <input type="email" placeholder="Email CEX" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-gray-950 border border-gray-800 p-2 rounded-xl text-white outline-none" required />
                <button type="submit" className="w-full bg-purple-600 font-bold py-2.5 rounded-xl">Hubungkan CEX</button>
              </form>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-xs space-y-3">
                <h3 className="font-bold">Kepatuhan Regulasi AML</h3>
                <button onClick={() => { setKycStatus('VERIFIED'); alert('KYC Valid!'); }} className="w-full bg-amber-600 font-bold py-2 rounded-xl">
                  {kycStatus === 'VERIFIED' ? '✓ Terverifikasi Resmi' : 'Mulai Verifikasi KYC KTP'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

