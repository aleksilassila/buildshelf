export interface Build {
    id: number,
    title: string,
    description: string,
    buildFile: string,
    images: string[],
    downloads: number,
    totalFavorites: number,
}