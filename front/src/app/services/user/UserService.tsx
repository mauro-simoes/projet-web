import { API_URL } from '@/app/core/constants';
import { APIResponseModel } from '@/app/models/ApiResponseModel';
import { AdminPasswordChangeRequest, PasswordChangeRequest, User } from '@/app/models/user/UserModels';
import axios from 'axios';


export async function getUserInfo(token: string) :Promise<APIResponseModel<User>> {
    var url :string = API_URL + "/user/get";
    return axios.get(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function getAllUsers(token: string) :Promise<APIResponseModel<User[]>> {
    var url :string = API_URL + "/user/get-all";
    return axios.get(url,{
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${token}`
        },
    })
} 

export async function updateUserProfile(user: User, token: string) :Promise<APIResponseModel<boolean>> {
    var url :string = API_URL + "/user/mise-a-jour";
    return axios.put(url,user, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${token}`
        },
    })
} 

export async function updateUserPassword(request: PasswordChangeRequest, token: string) :Promise<APIResponseModel<boolean>> {
    var url :string = API_URL + "/user/reinitialiser-mot-de-passe";
    return axios.post(url,request, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${token}`
        },
    })
} 


export async function approveUserAccount(userId: string, token: string) :Promise<APIResponseModel<boolean>>{
    var url :string = API_URL + "/user/valider-compte";
    return axios.post(url,{userId:userId}, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${token}`
        },
    })
} 

export async function suspendUserAccount(userId: string, token: string) :Promise<APIResponseModel<boolean>>{
    var url :string = API_URL + "/user/radier-compte";
    return axios.post(url,{userId:userId}, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${token}`
        },
    })
} 


export async function depotArgent(sum:number, token: string) :Promise<APIResponseModel<boolean>>{
    var url :string = API_URL + "/user/depot";
    return axios.put(url,{sum:sum}, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${token}`
        },
    })
} 
