import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoreData, LinkItem, LookbookItem, Profile, Theme, BrandNote } from '@/types';


interface Actions {
  setProfile: (profile: Partial<Profile>) => void;
  addLink: (link: Omit<LinkItem, 'id'>) => void;
  updateLink: (id: string, link: Partial<LinkItem>) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: LinkItem[]) => void;
  addLookbookImage: (image: string) => void;
  removeLookbookImage: (id: string) => void;
  reorderLookbook: (lookbook: LookbookItem[]) => void;
  updateBrandNote: (note: Partial<BrandNote>) => void;
  setTheme: (theme: Partial<Theme>) => void;
  resetAll: () => void;
  loadFromServer: () => Promise<void>;
  saveToServer: () => Promise<void>;
}

const initialState: StoreData = {
  profile: {
    logoDisplay: 'image',
    logoImage: '/uploads/defere-brand-card.png',
    logoText: 'DEFERE',
    slogan: 'Essential Aesthetics',
    description: '',
  },
  links: [
    { id: '1', title: 'Official Website', url: 'https://defere.co.kr', active: true },
    { id: '2', title: 'Instagram', url: 'https://instagram.com/defere_official', active: true },
    { id: '3', title: 'Naver BLOG', url: 'https://blog.naver.com/defere', active: true },
    { id: '4', title: 'Coupang', url: 'https://www.coupang.com', active: true },
    { id: '5', title: 'GS Shop', url: 'https://www.gsshop.com', active: true },
  ],
  lookbook: [],
  brandNote: {
    title: 'Coming Soon',
    content: 'Classic Structured Tote - Coming Soon\nWool Trench - Coming Soon',
    visible: true,
  },
  theme: {
    backgroundColor: '#ffffff',
    textColor: '#171717',
    accentColor: '#f4f4f4',
    buttonStyle: 'sharp',
  },
};

export const useStore = create<StoreData & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (newProfile) =>
        set((state) => ({ profile: { ...state.profile, ...newProfile } })),

      addLink: (link) =>
        set((state) => ({
          links: [...state.links, { ...link, id: crypto.randomUUID() }],
        })),

      updateLink: (id, updatedLink) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updatedLink } : link
          ),
        })),

      removeLink: (id) =>
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        })),
      
      reorderLinks: (newLinks) => set({ links: newLinks }),

      addLookbookImage: (image) =>
        set((state) => ({
          lookbook: [...state.lookbook, { id: crypto.randomUUID(), image }],
        })),

      removeLookbookImage: (id) =>
        set((state) => ({
          lookbook: state.lookbook.filter((item) => item.id !== id),
        })),

      reorderLookbook: (newLookbook) => set({ lookbook: newLookbook }),

      updateBrandNote: (note) =>
        set((state) => ({ brandNote: { ...state.brandNote, ...note } })),

      setTheme: (newTheme) =>
        set((state) => ({ theme: { ...state.theme, ...newTheme } })),

      resetAll: () => set(initialState),

      loadFromServer: async () => {
        try {
          const response = await fetch('/api/settings');
          if (response.ok) {
            const data = await response.json();
            if (data) {
              set(data);
            }
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      },

      saveToServer: async () => {
        const state = get();
        // Remove functions from state before saving
        const { 
          setProfile, addLink, updateLink, removeLink, reorderLinks,
          addLookbookImage, removeLookbookImage, reorderLookbook,
          updateBrandNote, setTheme, resetAll, loadFromServer, saveToServer,
          ...dataToSave 
        } = state;

        try {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
          });
          alert('서버에 저장되었습니다.');
        } catch (error) {
          console.error('Failed to save settings:', error);
          alert('저장 실패');
        }
      },
    }),
    {
      name: 'defere-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
