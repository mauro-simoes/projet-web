import { API_URL } from '@/app/core/constants';
import { allProductsMockData } from '@/app/core/mockData';
import { APIResponseModel } from '@/app/models/ApiResponseModel';
import { Order, Purchase } from '@/app/models/product/Order';
import { Product } from '@/app/models/product/ProductModels';
import axios from 'axios';

export async function getAllOrders(token :string) :Promise<APIResponseModel<Order[]>> {
    var url :string = API_URL + "/commandes/get-commandes/";
    return axios.get(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function getPendingOrders(token :string) :Promise<APIResponseModel<Order[]>> {
    var url :string = API_URL + "/commandes/get-commandes-en-attente";
    return axios.get(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 


export async function placeOrder(order :Order,token:string) :Promise<APIResponseModel<Order>> {
    var url :string = API_URL + "/commandes/commander";
    return axios.post(url,order,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function getBasketInfo(basket :string,token:string) :Promise<APIResponseModel<Purchase[]>> {
    var url :string = API_URL + "/commandes/basket-info";
    return axios.post(url,JSON.parse(basket),{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function shipOrder(token :string, order:Order) :Promise<APIResponseModel<Order[]>> {
    var url :string = API_URL + "/commandes/expedier";
    return axios.post(url,order,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 



