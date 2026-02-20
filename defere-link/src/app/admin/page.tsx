"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AdminProfile } from '@/components/admin/AdminProfile';
import { AdminLinks } from '@/components/admin/AdminLinks';
import { AdminLookbook } from '@/components/admin/AdminLookbook';
import { AdminBrandNote } from '@/components/admin/AdminBrandNote';
import { AdminTheme } from '@/components/admin/AdminTheme';
import { ArrowLeft, RefreshCw, Save, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

type Tab = 'profile' | 'links' | 'lookbook' | 'note' | 'theme';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [mounted, setMounted] = useState(false);
  const { resetAll } = useStore();

  useEffect(() => {
    setMounted(true);
    useStore.getState().loadFromServer();
  }, []);

  if (!mounted) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: '프로필' },
    { id: 'links', label: '링크' },
    { id: 'lookbook', label: '룩북' },
    { id: 'note', label: 'Coming Soon' },
    { id: 'theme', label: '디자인' },
  ];

  const handleReset = () => {
    if (confirm("모든 데이터가 초기화됩니다. 계속하시겠습니까?")) {
      resetAll();
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-900">
      <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
               <ArrowLeft size={20} />
            </Button>
            <h1 className="font-bold text-lg">관리자 패널</h1>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600">
               <RefreshCw size={16} className="mr-2" /> 초기화
             </Button>
             <Button variant="outline" size="sm" onClick={() => useStore.getState().saveToServer()}>
               <Save size={16} className="mr-2" /> 서버 저장
             </Button>
             <Button size="sm" onClick={() => router.push('/')}>
               완료 (메인으로)
             </Button>
             <Button variant="ghost" size="icon" onClick={handleLogout} title="로그아웃">
               <LogOut size={18} />
             </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-h-[600px] flex flex-col md:flex-row">
           {/* Sidebar Tabs */}
           <div className="w-full md:w-48 border-b md:border-b-0 md:border-r bg-gray-50/50 p-2 flex md:flex-col gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium rounded-md text-left transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                       ? 'bg-white text-black shadow-sm' 
                       : 'text-gray-500 hover:text-black hover:bg-gray-100'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Content Area */}
           <div className="flex-1 p-6 md:p-8 overflow-y-auto">
             {activeTab === 'profile' && <AdminProfile />}
             {activeTab === 'links' && <AdminLinks />}
             {activeTab === 'lookbook' && <AdminLookbook />}
             {activeTab === 'note' && <AdminBrandNote />}
             {activeTab === 'theme' && <AdminTheme />}
           </div>
        </div>
      </div>
    </div>
  );
}
