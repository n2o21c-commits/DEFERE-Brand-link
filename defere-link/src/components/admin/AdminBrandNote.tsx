import React, { useRef } from 'react';
import { useStore } from '@/store/useStore';
import { compressImage } from '@/utils/imageCompression';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export function AdminBrandNote() {
  const { brandNote, updateBrandNote } = useStore();
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  const images = brandNote.images ?? [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    const next = [...images];
    next[slot] = compressed;
    updateBrandNote({ images: next });
    e.target.value = '';
  };

  const handleRemove = (slot: number) => {
    const next = [...images];
    next.splice(slot, 1);
    updateBrandNote({ images: next });
  };

  const slots = [0, 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Coming Soon 설정</h2>
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
        <div className="space-y-5">
          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium mb-1">내용 (줄바꿈 가능)</label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={brandNote.content}
              onChange={(e) => updateBrandNote({ content: e.target.value })}
            />
          </div>

          {/* 이미지 2장 */}
          <div>
            <label className="block text-sm font-medium mb-3">이미지 (최대 2장)</label>
            <div className="grid grid-cols-2 gap-4">
              {slots.map((slot) => (
                <div key={slot} className="space-y-2">
                  <p className="text-xs text-gray-400">{slot + 1}번 이미지</p>
                  {images[slot] ? (
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border group">
                      <Image
                        src={images[slot]}
                        alt={`Coming Soon ${slot + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => handleRemove(slot)}
                      >
                        <X className="text-white" size={24} />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => (slot === 0 ? ref1 : ref2).current?.click()}
                      className="w-full aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <Upload size={24} className="mb-1" />
                      <span className="text-xs">파일 선택</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 숨김 파일 input */}
            <input ref={ref1} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 0)} />
            <input ref={ref2} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 1)} />
          </div>
        </div>
      )}
    </div>
  );
}
