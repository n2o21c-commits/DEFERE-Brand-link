import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkItem } from '@/types';
import { GripVertical, Trash2, Edit2 } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

interface SortableLinkItemProps {
  link: LinkItem;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SortableLinkItem({ link, onEdit, onRemove }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 mb-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
          <GripVertical size={20} />
        </button>
        <div className="flex flex-col truncate">
          <span className="font-semibold text-gray-800 truncate">{link.title}</span>
          <span className="text-xs text-gray-500 truncate">{link.url}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" onClick={() => onEdit(link.id)}>
            <Edit2 size={16} />
         </Button>
         <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onRemove(link.id)}>
            <Trash2 size={16} />
         </Button>
      </div>
    </div>
  );
}
