import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableLinkItem } from '@/components/SortableLinkItem';

export function AdminLinks() {
  const { links, addLink, updateLink, removeLink, reorderLinks } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over?.id);
      reorderLinks(arrayMove(links, oldIndex, newIndex));
    }
  };

  const handleAddLink = () => {
    if (newLinkTitle && newLinkUrl) {
      addLink({ title: newLinkTitle, url: newLinkUrl, active: true });
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold">링크 관리</h2>
         <Button onClick={() => setIsAdding(!isAdding)} size="sm" variant="outline">
           <Plus size={16} className="mr-2" /> 새 링크
         </Button>
       </div>

       {isAdding && (
         <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
           <Input
             placeholder="링크 제목 (예: 인스타그램)"
             value={newLinkTitle}
             onChange={(e) => setNewLinkTitle(e.target.value)}
           />
           <Input
             placeholder="URL (https://...)"
             value={newLinkUrl}
             onChange={(e) => setNewLinkUrl(e.target.value)}
           />
           <div className="flex gap-2 justify-end">
             <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>취소</Button>
             <Button size="sm" onClick={handleAddLink}>추가</Button>
           </div>
         </div>
       )}

       <DndContext
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragEnd={handleDragEnd}
       >
         <SortableContext
           items={links.map(l => l.id)}
           strategy={verticalListSortingStrategy}
         >
           <div className="space-y-2">
             {links.map((link) => (
               <SortableLinkItem 
                  key={link.id} 
                  link={link} 
                  onEdit={() => {
                    // Simple prompt for now, or expand inline edit
                    const title = prompt("새 제목", link.title);
                    if (title) updateLink(link.id, { title });
                    const url = prompt("새 URL", link.url);
                    if (url) updateLink(link.id, { url });
                  }}
                  onRemove={removeLink}
               />
             ))}
           </div>
         </SortableContext>
       </DndContext>
    </div>
  );
}
