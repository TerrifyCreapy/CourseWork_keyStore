export interface IInitialGame {
    id:number;
    name: string;
    description: string;
    img: File;
    price: number;
    discount: number;
    dateRealise: string;
    platforms: number[],
    tags: number[]
}