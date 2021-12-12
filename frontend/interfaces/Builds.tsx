export interface Tag {
    name: string,
}

export interface Category {
    name: string,
}

export interface Collection {
    id: number,
    name: string,
    description: string,
    ownerId: string,
}

export interface Build {
    id: number,
    title: string,
    description: string,
    buildFile: string,
    images: string[],
    downloads: number,
    totalFavorites: number,
    creator: {
        username: string,
        uuid: string,
    },
    tags: Tag[],
    category: Category,
    collection: Collection,
}

export interface User {
    username: string,
    uuid: string,
}