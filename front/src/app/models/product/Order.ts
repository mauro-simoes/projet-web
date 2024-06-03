import { StringDecoder } from "string_decoder";
import { User } from "../user/UserModels";
import { Product } from "./ProductModels";

export interface Order{
    _id:string;
    user:User;
    purchases: Purchase[];
    commandDateTime :string;
    total:number;
    deliveryAddress:string;
}

export interface Purchase{
    quantite: number;
    product:Product;
    purchasePrice:number;
}