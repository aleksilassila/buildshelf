export interface Tag {
  name: string;
}

export interface Category {
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  images: Image[] | undefined;
  totalFavorites: number;
  builds: Build[] | undefined;
  creator: User | undefined;
}

export interface Build {
  id: number;
  title: string;
  description: string;
  buildFile: BuildFile;
  images: Image[];
  totalDownloads: number;
  totalSaves: number;
  creator?: User;
  tags: Tag[];
  category: Category;
  collection?: Collection;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
}

export interface User {
  username: string;
  uuid: string;
  saves?: Build[];
  follows?: User[];
}

export interface Image {
  id: number;
  filename: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
}

export interface BuildFile {
  id: number;
  filename: string;
  version: number;
  minecraftDataVersion: number;
  x: number;
  y: number;
  z: number;
  blockCount: number;
  md5: string;
}
