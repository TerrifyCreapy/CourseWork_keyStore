export interface IBasket {
    id: number;
    name: string;
    price: number;
    discount: number;
    img: string;
    count: number;
    platform: {
        id: number;
        name: string;
    }
}
