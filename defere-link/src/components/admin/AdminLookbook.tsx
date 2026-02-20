import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { compressImage } from '@/utils/imageCompression';
import { Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';

export function AdminLookbook() {
  const { lookbook, addLookbookImage, removeLookbookImage } = useStore();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          addLookbookImage(url);
        } else {
          const data = await response.json();
          console.error('Upload failed:', data);
          alert('파일 업로드 실패: ' + (data.error ?? '알 수 없는 오류'));
        }
      }
    } catch (error) {
      console.error(error);
      alert('이미지 업로드 오류');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">룩북 관리</h2>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={loading}
          />
          <Button disabled={loading}>
            <Upload size={16} className="mr-2" />
            {loading ? '업로드 중...' : '이미지 추가'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {lookbook.map((item) => (
          <div key={item.id} className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border">
            <Image src={item.image} alt="Lookbook" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => removeLookbookImage(item.id)}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {lookbook.length === 0 && (
         <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
            룩북 이미지가 없습니다.
         </div>
      )}
    </div>
  );
}
