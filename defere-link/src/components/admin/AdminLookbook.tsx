import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { compressImage } from '@/utils/imageCompression';

interface LookbookSectionProps {
  title: string;
  description: string;
  items: { id: string; image: string }[];
  onAdd: (url: string) => void;
  onRemove: (id: string) => void;
}

function LookbookSection({ title, description, items, onAdd, onRemove }: LookbookSectionProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBase64 = await compressImage(file);
        onAdd(compressedBase64);
      }
    } catch (error) {
      alert('이미지 처리 오류: ' + String(error));
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={loading}
          />
          <Button size="sm" disabled={loading}>
            <Upload size={14} className="mr-1.5" />
            {loading ? '업로드 중...' : '사진 추가'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border">
            <Image src={item.image} alt="Lookbook" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="destructive" size="icon" onClick={() => onRemove(item.id)}>
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg text-sm">
          여기에 사진을 추가하세요.
        </div>
      )}
    </div>
  );
}

export function AdminLookbook() {
  const {
    lookbook, addLookbookImage, removeLookbookImage,
    lookbookBottom, addLookbookBottomImage, removeLookbookBottomImage,
  } = useStore();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">룩북 관리</h2>
      <p className="text-sm text-gray-500 -mt-3">상단 / 하단 두 구역의 사진을 각각 독립적으로 관리합니다.</p>

      <LookbookSection
        title="📷 상단 룩북 (Top)"
        description="메인 페이지 '상단' 슬라이더에 표시되는 사진입니다."
        items={lookbook}
        onAdd={addLookbookImage}
        onRemove={removeLookbookImage}
      />

      <LookbookSection
        title="🖼️ 하단 룩북 (Bottom)"
        description="메인 페이지 '하단' 슬라이더에 표시되는 사진입니다."
        items={lookbookBottom}
        onAdd={addLookbookBottomImage}
        onRemove={removeLookbookBottomImage}
      />
    </div>
  );
}
