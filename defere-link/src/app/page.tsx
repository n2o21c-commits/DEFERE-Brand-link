"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { Grid3X3, Bookmark, UserSquare2, Home, Search, PlusSquare, PlaySquare, Menu, Send, ChevronDown } from 'lucide-react';

function FadeSlider({ items, interval = 3500, emptyLabel }: { items: { id: string; image: string }[], interval?: number, emptyLabel?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items.length, interval]);

  if (items.length === 0) {
    return (
      <div className="aspect-[4/5] flex flex-col items-center justify-center text-zinc-700 gap-2 text-sm bg-zinc-950">
        <Grid3X3 className="w-7 h-7 opacity-30" />
        <span>{emptyLabel ?? '사진 없음'}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
      {items.map((item, i) => (
        <img
          key={item.id}
          src={item.image}
          alt="Lookbook"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {items.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { profile, links, lookbook, lookbookBottom, brandNote } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    setMounted(true);
    useStore.getState().loadFromServer();
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  const activeLinks = links.filter((link) => link.active);

  return (
    <main
      className="bg-black text-white antialiased min-h-screen font-sans selection:bg-[#3211d4] selection:text-white"
    >
      <div className="mx-auto w-full max-w-md min-h-screen flex flex-col relative bg-black overflow-hidden sm:border-x sm:border-zinc-800">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 sticky top-0 bg-black z-50">
          <div className="flex items-center gap-1 cursor-pointer">
            <h1 className="text-xl font-bold tracking-tight">{profile.logoText || 'defere'}</h1>
            <ChevronDown className="w-4 h-4 text-white hover:opacity-70" />
            <span className="material-symbols-outlined text-[16px] text-blue-500 ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div className="flex items-center gap-5 text-white">
            <a href="mailto:info@defere.co.kr" className="hover:opacity-70 transition-opacity">
               <PlusSquare className="w-6 h-6" />
            </a>
            <Link href="/admin" className="hover:opacity-70 transition-opacity">
               <Menu className="w-6 h-6" />
            </Link>
          </div>
        </header>

        <div className="overflow-y-auto pb-16 flex-1 scrollbar-hide">
          {/* Profile Header */}
          <section className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between gap-6 relative">
              {/* Avatar */}
              <div className="shrink-0 relative">
                <div className="w-[84px] h-[84px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                  <div className="w-full h-full rounded-full border-[3px] border-black overflow-hidden bg-zinc-900">
                    {profile.logoImage ? (
                      <img src={profile.logoImage} alt="Profile" className="w-full h-full object-cover bg-white" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <UserSquare2 />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-[3px] border-black text-white w-6 h-6 flex items-center justify-center">
                  <span className="text-[14px] font-bold leading-none mb-[1px]">+</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-1 justify-around text-center mr-2">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-[17px]">{lookbook.length || 0}</span>
                  <span className="text-[13px]">게시물</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-[17px]">11.2K</span>
                  <span className="text-[13px]">팔로워</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-[17px]">12</span>
                  <span className="text-[13px]">팔로잉</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-3">
              <h2 className="font-medium text-[14px] leading-tight">{profile.logoText || 'DEFERE'}</h2>
              <p className="text-[13px] text-zinc-400 mb-0.5 leading-tight">의류(브랜드)</p>
              <p className="text-[14px] whitespace-pre-line leading-tight">
                {profile.slogan || 'Essential Aesthetics'}{'\n'}
                {profile.description}
              </p>
              <a href="mailto:info@defere.co.kr" className="text-[14px] font-medium text-[#e0f2fe] mt-[2px] block">
                info@defere.co.kr
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white py-[6px] rounded-lg font-semibold text-[14px]">
                팔로잉
              </button>
              <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white py-[6px] rounded-lg font-semibold text-[14px]">
                메시지
              </button>
              <a href="mailto:info@defere.co.kr" className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition-colors text-center text-white py-[6px] rounded-lg font-semibold text-[14px]">
                연락처
              </a>
              <button className="bg-zinc-800 hover:bg-zinc-700 transition-colors text-white p-[6px] rounded-lg flex items-center justify-center h-[32px] w-[32px]">
                <UserSquare2 className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Story Highlights (Connect Links) */}
          {activeLinks.length > 0 && (
            <section className="px-2 py-3 flex justify-center overflow-x-auto gap-[18px] scrollbar-hide w-full">
              {activeLinks.map((link) => {
                const isSmartStore = link.title.toLowerCase().includes('smart');
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-[6px] shrink-0 w-16 group"
                  >
                    <div className="w-[64px] h-[64px] rounded-full p-[2px] border border-zinc-700 bg-black group-hover:opacity-80 transition-opacity">
                      <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 border border-black flex items-center justify-center">
                        {isSmartStore ? (
                           <img src="/smartstore_logo.png" alt="Smart Store" className="w-[44px] h-[44px] object-contain" />
                        ) : (
                          <span className="text-[28px] leading-none flex items-center justify-center w-full h-full">
                            {getLinkEmoji(link.title)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-center truncate w-[200%] px-1">{link.title}</span>
                  </a>
                );
              })}
            </section>
          )}

          {/* Connect & Inquiry Info (Collapsible imitation) */}
          <div className="px-4 py-2 text-[12px] text-zinc-500 flex justify-center items-center gap-1 border-b border-zinc-800 pb-4">
            <span className="material-symbols-outlined text-[14px]">link</span>
            Connect Links above. Tap icons to connect!
          </div>

          {/* Coming Soon Note as well if visible */}
          {brandNote.visible && (brandNote.content || (brandNote.images && brandNote.images.length > 0)) && (
            <div className="px-4 py-4 mb-2">
               <div className="p-3 bg-zinc-900 rounded-lg text-sm border border-zinc-800">
                  <p className="font-bold flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                    {brandNote.title || '새소식'}
                  </p>
                  
                  {/* Coming Soon Images */}
                  {brandNote.images && brandNote.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {brandNote.images.slice(0, 2).map((src, i) => (
                        <div key={i} className="aspect-square bg-black rounded-md overflow-hidden border border-zinc-800">
                          <img src={src} alt="Coming soon" className="w-full h-full object-cover opacity-90" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coming Soon Text */}
                  {brandNote.content && (
                    <p className="text-zinc-300 whitespace-pre-line text-[13px]">{brandNote.content}</p>
                  )}
               </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-t border-zinc-800 mt-0">
            <button 
              className={`flex-1 flex justify-center py-3 ${activeTab === 'posts' ? 'border-b-[1px] border-white text-white' : 'text-zinc-500'}`}
              onClick={() => setActiveTab('posts')}
            >
              <Grid3X3 className="w-[22px] h-[22px]" />
            </button>
            <button 
              className={`flex-1 flex justify-center py-3 ${activeTab === 'reels' ? 'border-b-[1px] border-white text-white' : 'text-zinc-500'}`}
              onClick={() => setActiveTab('reels')}
            >
              <PlaySquare className="w-[22px] h-[22px]" />
            </button>
            <button 
              className={`flex-1 flex justify-center py-3 ${activeTab === 'tagged' ? 'border-b-[1px] border-white text-white' : 'text-zinc-500'}`}
              onClick={() => setActiveTab('tagged')}
            >
              <UserSquare2 className="w-[22px] h-[22px]" />
            </button>
          </div>

          {/* Sliders — 2 Tier */}
          {activeTab === 'posts' && (
            <div className="space-y-[2px]">
              <FadeSlider items={lookbook} interval={3500} emptyLabel="상단 룩북 사진 없음" />
              <FadeSlider items={lookbookBottom} interval={4200} emptyLabel="하단 룩북 사진 없음" />
            </div>
          )}

          {activeTab !== 'posts' && (
            <div className="flex flex-col items-center justify-center p-12 text-zinc-500">
              <div className="w-[60px] h-[60px] rounded-full border-2 border-zinc-700 flex items-center justify-center mb-4">
                {activeTab === 'reels' ? <PlaySquare className="w-7 h-7" /> : <UserSquare2 className="w-7 h-7" />}
              </div>
              <h3 className="font-bold text-[18px] text-white mb-2">
                {activeTab === 'reels' ? '릴스' : '태그됨'}
              </h3>
              <p className="text-[14px] text-center">아직 게시물이 없습니다.</p>
            </div>
          )}
        </div>
        
        {/* Bottom Nav */}
        <nav className="border-t border-zinc-900 bg-black absolute bottom-0 w-full flex justify-around py-3 z-50">
           <Link href="/" className="text-white">
             <Home className="w-[26px] h-[26px]" />
           </Link>
           <button className="text-zinc-400 hover:text-white transition-colors">
             <Search className="w-[26px] h-[26px]" />
           </button>
           <button className="text-zinc-400 hover:text-white transition-colors">
             <PlusSquare className="w-[26px] h-[26px]" />
           </button>
           <button className="text-zinc-400 hover:text-white transition-colors">
             <PlaySquare className="w-[26px] h-[26px]" />
           </button>
           <div className="w-[26px] h-[26px] rounded-full overflow-hidden border border-zinc-400">
              {profile.logoImage ? (
                <img src={profile.logoImage} className="w-full h-full object-cover bg-white" />
              ) : (
                <div className="w-full h-full bg-zinc-800" />
              )}
           </div>
        </nav>
      </div>
    </main>
  );
}

function getLinkEmoji(title: string): React.ReactNode {
  const t = title.toLowerCase();
  
  if (t.includes('smart') || t.includes('스마트')) {
    return <img src="/smartstore_logo.png" alt="Smart Store" className="h-5 w-auto object-contain rounded-sm" />;
  }

  if (t.includes('instagram') || t.includes('인스타')) return '📸';
  if (t.includes('website') || t.includes('웹사이트') || t.includes('홈페이지')) return '🌐';
  if ((t.includes('naver') || t.includes('네이버')) && (t.includes('blog') || t.includes('블로그'))) return '📝';
  if (t.includes('naver') || t.includes('네이버')) return '🛍️';
  if (t.includes('coupang') || t.includes('쿠팡')) return '📦';
  if (t.includes('lotte') || t.includes('롯데')) return '🏬';
  if (t.includes('youtube') || t.includes('유튜브')) return '▶️';
  if (t.includes('kakao') || t.includes('카카오')) return '💬';
  if (t.includes('tiktok') || t.includes('틱톡')) return '🎵';
  if (t.includes('twitter') || t.includes('x.com')) return '🐦';
  if (t.includes('blog') || t.includes('블로그')) return '✍️';
  if (t.includes('shop') || t.includes('store') || t.includes('쇼핑')) return '🛒';
  
  return '🔗';
}
