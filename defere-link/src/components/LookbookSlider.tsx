import React from 'react';
import { motion } from 'framer-motion';
import { LookbookItem } from '@/types';
import Image from 'next/image';

interface LookbookSliderProps {
  items: LookbookItem[];
}

export function LookbookSlider({ items }: LookbookSliderProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full overflow-hidden py-6">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scrollbar-hide">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-[80vw] sm:w-[400px] h-[500px] relative bg-gray-100 rounded-lg overflow-hidden snap-center shadow-md"
          >
            <Image
              src={item.image}
              alt="Lookbook"
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
