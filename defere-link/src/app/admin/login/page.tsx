"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error ?? '오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1
          className="text-3xl font-bold text-white text-center mb-2"
          style={{ letterSpacing: '-0.03em' }}
        >
          DEFERE
        </h1>
        <p className="text-slate-500 text-xs text-center tracking-widest uppercase mb-10">
          Admin
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#131022] border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold rounded-lg py-3 text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
