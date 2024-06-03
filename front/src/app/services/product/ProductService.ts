import { API_URL } from '@/app/core/constants';
import { allProductsMockData } from '@/app/core/mockData';
import { APIResponseModel } from '@/app/models/ApiResponseModel';
import { Product } from '@/app/models/product/ProductModels';
import axios from 'axios';

export async function getProductById(id :string) :Promise<APIResponseModel<Product>> {
    var url :string = API_URL + "/produit/get/" + id;
    return axios.get(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
        },
    })
} 


export async function getAllProducts(category :string) :Promise<APIResponseModel<Product[]>> {
    var url :string = API_URL + "/produit/get/all/" + category;
    return axios.get(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
        },
    })
} 

export async function addProduct(product: Product, token: string) :Promise<APIResponseModel<boolean>> {
    var url :string = API_URL + "/produit/ajouter-produit";
    return axios.post(url,product, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function updateProduct(product: Product, token: string) :Promise<APIResponseModel<boolean>> {
    var url :string = API_URL + "/produit/mettre-a-jour";
    return axios.put(url,product, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function deleteProduct(productId: number, token: string) :Promise<APIResponseModel<boolean>> {
    var url :string = API_URL + "/produit/supprimer-produit/" + productId;
    return axios.delete(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
}