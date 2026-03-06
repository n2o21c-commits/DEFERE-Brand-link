export interface LinkItem {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

export interface Profile {
  logoDisplay: 'text' | 'image'; // 로고 표시 방식
  logoText: string;
  logoImage?: string; // base64
  slogan: string;
  description: string;
}

export interface LookbookItem {
  id: string;
  image: string; // base64
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  accentColor: string; // Button background, highlights
  buttonStyle: 'rounded' | 'sharp'; // 0px or 4px
}

export interface BrandNote {
  title: string;
  content: string;
  image?: string; // base64 (legacy)
  images?: string[]; // base64 array (Coming Soon 이미지 2장)
  visible: boolean;
}

export interface StoreData {
  profile: Profile;
  links: LinkItem[];
  lookbook: LookbookItem[];
  lookbookBottom: LookbookItem[];
  brandNote: BrandNote;
  theme: Theme;
}
