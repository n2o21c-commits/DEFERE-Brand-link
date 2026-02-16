"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { LookbookSlider } from '@/components/LookbookSlider';
import { BrandNote } from '@/components/BrandNote';
import { Button } from '@/components/ui/Button';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const { profile, links, lookbook, brandNote, theme } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />; // Prevent hydration mismatch
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center py-10 px-4 transition-colors duration-300"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Header */}
      <header className="flex flex-col items-center gap-4 mb-8 text-center animate-fade-in-down">
        {profile.logoDisplay === 'image' && profile.logoImage ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
            <Image src={profile.logoImage} alt="Logo" fill className="object-cover" />
          </div>
        ) : (
          <h1 className="text-3xl font-bold tracking-widest font-serif">
            {profile.logoText}
          </h1>
        )}
        <p className="text-sm text-gray-500 font-light tracking-wide">
          {profile.slogan}
        </p>
      </header>

      {/* Lookbook Slider */}
      {lookbook.length > 0 && (
         <section className="w-full max-w-md mb-8">
            <LookbookSlider items={lookbook} />
         </section>
      )}

      {/* Link List */}
      <section className="w-full max-w-md space-y-4 mb-12">
        {links
          .filter((link) => link.active)
          .map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div
                  className={`w-full py-4 px-6 text-center font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-200
                    ${theme.buttonStyle === 'rounded' ? 'rounded-xl' : 'rounded-sm'}
                  `}
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.textColor,
                  }}
                >
                  {link.title}
                </div>
              </a>
            </motion.div>
          ))}
      </section>

      {/* Brand Note */}
      {brandNote.visible && (
        <section className="w-full">
          <BrandNote note={brandNote} />
        </section>
      )}

      {/* Footer / Admin Link */}
      <footer className="mt-auto py-6 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
        <p className="text-xs font-light">
          © {new Date().getFullYear()} {profile.logoText}. Powered by DEFERE Link.
        </p>
      </footer>
    </main>
  );
}
