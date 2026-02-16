import React from 'react';
import { BrandNote as BrandNoteType } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandNoteProps {
  note: BrandNoteType;
}

export function BrandNote({ note }: BrandNoteProps) {
  if (!note.visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full px-4 py-12 bg-secondary/30 my-8"
    >
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-center font-serif">
          {note.title}
        </h2>
        
        {note.image && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
             <Image
              src={note.image}
              alt={note.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line text-justify">
          {note.content}
        </p>
      </div>
    </motion.div>
  );
}
