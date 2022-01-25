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
  images: string[];
  totalFavorites: number;
  creator?: User;
  builds?: Build[];
}

export interface Build {
  id: number;
  title: string;
  description: string;
  buildFile: {
    filename: string,
    version: number,
    minecraftDataVersion: number,
    enclosingSize: {
      x: number,
      y: number,
      z: number,
    },
    blockCount: number,
    md5: string,
  };
  images: string[];
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
