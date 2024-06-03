import { User } from "../user/UserModels";

export interface Product {
    _id: number,
    name: string,
    category: string,
    discount: number,
    price: number,
    stock: number,
    description: string,
    comment: string,
    image:string,
    addedDate:string,
    nbSales:number
}
