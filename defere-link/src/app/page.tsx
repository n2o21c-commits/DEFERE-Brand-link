"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

function getLinkEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('instagram') || t.includes('인스타')) return '📸';
  if (t.includes('website') || t.includes('웹사이트') || t.includes('홈페이지')) return '🌐';
  if ((t.includes('naver') || t.includes('네이버')) && (t.includes('blog') || t.includes('블로그'))) return '📝';
  if (t.includes('naver') || t.includes('네이버')) return '🛍️';
  if (t.includes('coupang') || t.includes('쿠팡')) return '📦';
  if (t.includes('gs')) return '🏬';
  if (t.includes('youtube') || t.includes('유튜브')) return '▶️';
  if (t.includes('kakao') || t.includes('카카오')) return '💬';
  if (t.includes('tiktok') || t.includes('틱톡')) return '🎵';
  if (t.includes('twitter') || t.includes('x.com')) return '🐦';
  if (t.includes('blog') || t.includes('블로그')) return '✍️';
  if (t.includes('shop') || t.includes('store') || t.includes('쇼핑')) return '🛒';
  return '🔗';
}

export default function Home() {
  const { profile, links, lookbook, brandNote } = useStore();
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    useStore.getState().loadFromServer();
  }, []);

  const prev = useCallback(() => {
    if (lookbook.length === 0) return;
    setCurrentIndex((i) => (i - 1 + lookbook.length) % lookbook.length);
  }, [lookbook.length]);

  const next = useCallback(() => {
    if (lookbook.length === 0) return;
    setCurrentIndex((i) => (i + 1) % lookbook.length);
  }, [lookbook.length]);

  // 자동 롤링
  useEffect(() => {
    if (lookbook.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [lookbook.length, next]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  const activeLinks = links.filter((link) => link.active);
  const heroImage = lookbook.length > 0 ? lookbook[currentIndex].image : null;

  return (
    <main
      className="bg-[#050505] text-slate-100 antialiased min-h-screen selection:bg-[#3211d4] selection:text-white"
      style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
    >
      <div className="mx-auto w-full max-w-md min-h-screen flex flex-col relative shadow-2xl overflow-hidden">

        {/* Hero Carousel */}
        <header className="relative w-full h-[70vh] md:h-[38vh] overflow-hidden">
          {/* 이미지 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: heroImage
                ? `url('${heroImage}')`
                : 'linear-gradient(135deg, #131022 0%, #1a0a2e 50%, #050505 100%)',
            }}
          />

          {/* 상단·하단 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />

          {/* 이전/다음 버튼 — 이미지 중앙 좌우 */}
          {lookbook.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 transition-all duration-200 backdrop-blur-sm border border-white/10"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 transition-all duration-200 backdrop-blur-sm border border-white/10"
                aria-label="다음 이미지"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* 브랜드 타이틀 — 수직 중앙 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center fade-in-up z-10">
            <h1
              className="text-5xl font-bold text-white drop-shadow-lg"
              style={{ letterSpacing: '-0.03em' }}
            >
              {profile.logoText || 'DEFERE'}
            </h1>
            <p className="text-white/70 text-[10px] tracking-[0.25em] uppercase font-light mt-3">
              {profile.slogan || 'Essential Aesthetics'}
            </p>
          </div>

          {/* 인디케이터 — 맨 하단, 타이틀과 분리 */}
          {lookbook.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
              {lookbook.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'
                  }`}
                  aria-label={`${i + 1}번 이미지`}
                />
              ))}
            </div>
          )}
        </header>

        {/* Connect Links */}
        {activeLinks.length > 0 && (
          <section className="px-6 pt-6 fade-in-up delay-100 mb-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-400">Connect</h3>
              <span className="h-[1px] flex-grow ml-4 bg-white/10" />
            </div>
            <div className="space-y-3">
              {activeLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative flex items-center justify-between w-full p-4 rounded-lg group transition-all duration-300 ${
                    index === 0
                      ? 'bg-white text-black hover:bg-slate-200 shadow-lg'
                      : 'bg-[#131022] border border-white/10 text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3 font-medium tracking-wide">
                    <span className="text-xl leading-none">{getLinkEmoji(link.title)}</span>
                    {link.title}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[18px] transition-all duration-300 group-hover:translate-x-0.5 ${
                      index === 0 ? 'text-black/40 group-hover:text-black' : 'text-white/30 group-hover:text-white'
                    }`}
                  >
                    north_east
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon */}
        {brandNote.visible && (
          <section className="px-6 pb-6 fade-in-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-400">
                Coming Soon
              </h3>
              <span className="h-[1px] flex-grow ml-4 bg-white/10" />
            </div>

            {/* Coming Soon 이미지 2장 */}
            {(() => {
              const imgs = (brandNote.images ?? []).filter(Boolean).slice(0, 2);
              if (imgs.length === 0) return null;
              return (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {imgs.map((src, i) => (
                    <div
                      key={i}
                      className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-[#131022]"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                        style={{ backgroundImage: `url('${src}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Coming Soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* 브랜드 노트 텍스트 */}
            {brandNote.content && (
              <div className="glass-panel rounded-xl p-4">
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {brandNote.content}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Inquiry */}
        <section className="px-6 pb-12 fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-400">Inquiry</h3>
            <span className="h-[1px] flex-grow ml-4 bg-white/10" />
          </div>
          <div className="glass-panel rounded-xl p-4 shadow-lg ring-1 ring-white/10">
            <div className="flex flex-col gap-4">
              <a
                className="flex items-center gap-4 group text-white hover:text-slate-300 transition-colors"
                href="mailto:info@defere.co.kr"
              >
                <div className="bg-white/5 p-2 rounded-full group-hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold block text-slate-500">
                    Business Email
                  </span>
                  <span className="text-sm font-medium">info@defere.co.kr</span>
                </div>
              </a>
              <a
                className="flex items-center gap-4 group text-white hover:text-slate-300 transition-colors"
                href="#"
              >
                <div className="bg-white/5 p-2 rounded-full group-hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold block text-slate-500">
                    Customer Support
                  </span>
                  <span className="text-sm font-medium">1:1 Inquiry</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-white/5 bg-[#050505] mt-auto">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
              © {new Date().getFullYear()} {profile.logoText || 'DEFERE'}. All rights reserved.
            </p>
            <Link href="/admin" className="opacity-20 hover:opacity-80 transition-opacity">
              <Settings className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}
