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
  buildFile: string;
  images: string[];
  totalDownloads: number;
  totalFavorites: number;
  creator?: User;
  tags: Tag[];
  category: Category;
  collection?: Collection;
  createdAt: string;
  isFavorite?: boolean;
}

export interface User {
  username: string;
  uuid: string;
  favorites?: Build[];
  follows?: User[];
}
