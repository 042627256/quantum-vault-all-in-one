import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { model, messages } = await req.json();
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (['create virus', 'jailbreak', 'buat malware'].some(p => lastMsg.includes(p))) {
      return NextResponse.json({ error: 'Aksi ditolak keamanan server.' }, { status: 403 });
    }

    const response = await fetch(`https://railway.app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-6e4c5defb3de6300-twi7qt-24c79688`,
      },
      body: JSON.stringify({ model: model || 'gpt-4o-mini', messages }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Kesalahan Jaringan Serverless.' }, { status: 500 });
  }
}

