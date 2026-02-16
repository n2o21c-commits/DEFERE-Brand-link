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
}

const initialState: StoreData = {
  profile: {
    logoDisplay: 'text',
    logoText: 'DEFERE',
    slogan: 'Essential items for your daily life.',
    description: '',
  },
  links: [
    { id: '1', title: 'Official Store', url: 'https://smartstore.naver.com/defere', active: true },
    { id: '2', title: 'Instagram', url: 'https://instagram.com/defere_official', active: true },
  ],
  lookbook: [],
  brandNote: {
    title: 'Material & Process',
    content: 'DEFERE uses high-quality fabrics...',
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
    (set) => ({
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
    }),
    {
      name: 'defere-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
