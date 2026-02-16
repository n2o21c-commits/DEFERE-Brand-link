import React from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function AdminTheme() {
  const { theme, setTheme } = useStore();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">디자인 테마 설정</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">배경색 (Background)</label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={theme.backgroundColor}
              onChange={(e) => setTheme({ backgroundColor: e.target.value })}
              className="w-12 h-10 p-1"
            />
            <Input 
              value={theme.backgroundColor}
              onChange={(e) => setTheme({ backgroundColor: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">텍스트 색상 (Text)</label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={theme.textColor}
              onChange={(e) => setTheme({ textColor: e.target.value })}
              className="w-12 h-10 p-1"
            />
             <Input 
              value={theme.textColor}
              onChange={(e) => setTheme({ textColor: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">강조/버튼 색상 (Accent)</label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={theme.accentColor}
              onChange={(e) => setTheme({ accentColor: e.target.value })}
              className="w-12 h-10 p-1"
            />
             <Input 
              value={theme.accentColor}
              onChange={(e) => setTheme({ accentColor: e.target.value })}
            />
          </div>
        </div>
      </div>
      
      <div>
         <label className="block text-sm font-medium mb-2">버튼 스타일</label>
         <div className="flex gap-4">
            <Button
              className="rounded-xl w-32 border-2"
              variant={theme.buttonStyle === 'rounded' ? 'default' : 'outline'}
              onClick={() => setTheme({ buttonStyle: 'rounded' })}
            >
              Rounded
            </Button>
            <Button
              className="rounded-none w-32 border-2"
              variant={theme.buttonStyle === 'sharp' ? 'default' : 'outline'}
              onClick={() => setTheme({ buttonStyle: 'sharp' })}
            >
              Sharp
            </Button>
         </div>
      </div>
    </div>
  );
}
