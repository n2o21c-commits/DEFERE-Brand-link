import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { compressImage } from '@/utils/imageCompression';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export function AdminProfile() {
  const { profile, setProfile } = useStore();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const compressed = await compressImage(file);
      setProfile({ logoImage: compressed });
    } catch (error) {
      console.error('Image upload failed', error);
      alert('이미지 업로드 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">프로필 설정</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">로고 표시 방식</label>
          <div className="flex gap-4">
            <Button 
              variant={profile.logoDisplay === 'text' ? 'default' : 'outline'}
              onClick={() => setProfile({ logoDisplay: 'text' })}
            >
              텍스트
            </Button>
            <Button 
              variant={profile.logoDisplay === 'image' ? 'default' : 'outline'}
              onClick={() => setProfile({ logoDisplay: 'image' })}
            >
              이미지
            </Button>
          </div>
        </div>

        {profile.logoDisplay === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-1">로고 텍스트</label>
            <Input 
              value={profile.logoText} 
              onChange={(e) => setProfile({ logoText: e.target.value })} 
              placeholder="DEFERE"
            />
          </div>
        )}

        {profile.logoDisplay === 'image' && (
          <div>
            <label className="block text-sm font-medium mb-1">로고 이미지</label>
            <div className="flex items-center gap-4">
              {profile.logoImage ? (
                <div className="relative w-20 h-20 rounded-full border overflow-hidden group">
                  <Image src={profile.logoImage} alt="Logo" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setProfile({ logoImage: undefined })}>
                    <X className="text-white" size={20} />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50 text-gray-400">
                  <Upload size={20} />
                </div>
              )}
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full max-w-xs"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">슬로건</label>
          <Input 
            value={profile.slogan} 
            onChange={(e) => setProfile({ slogan: e.target.value })} 
            placeholder="브랜드 슬로건을 입력하세요"
          />
        </div>
      </div>
    </div>
  );
}
