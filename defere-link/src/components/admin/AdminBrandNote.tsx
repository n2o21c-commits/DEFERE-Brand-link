import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { compressImage } from '@/utils/imageCompression';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export function AdminBrandNote() {
  const { brandNote, updateBrandNote } = useStore();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const compressed = await compressImage(file);
      updateBrandNote({ image: compressed });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">브랜드 노트 설정</h2>
        <div className="flex items-center gap-2">
           <label className="text-sm font-medium">노출 여부</label>
           <input 
             type="checkbox" 
             checked={brandNote.visible}
             onChange={(e) => updateBrandNote({ visible: e.target.checked })}
             className="w-4 h-4"
           />
        </div>
      </div>

      {brandNote.visible && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <Input 
              value={brandNote.title}
              onChange={(e) => updateBrandNote({ title: e.target.value })}
            />
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">내용 (줄바꿈 가능)</label>
             <textarea 
               className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
               value={brandNote.content}
               onChange={(e) => updateBrandNote({ content: e.target.value })}
             />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">이미지</label>
            {brandNote.image ? (
                <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border group mb-2">
                  <Image src={brandNote.image} alt="Brand Note" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => updateBrandNote({ image: undefined })}>
                    <X className="text-white" size={24} />
                  </div>
                </div>
            ) : (
                <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-gray-400 mb-2">
                   <Upload size={32} className="mb-2" />
                   <span>이미지 업로드</span>
                </div>
            )}
            <Input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageUpload}
                 disabled={loading}
              />
          </div>
        </div>
      )}
    </div>
  );
}
