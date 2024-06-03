import { API_URL } from '@/app/core/constants';
import { authenticationMockData } from '@/app/core/mockData';
import { APIResponseModel } from '@/app/models/ApiResponseModel';
import { AuthResponse, LogInRequest, SignUpRequest } from '@/app/models/auth/AuthModels';
import axios from 'axios';


export async function signUp(request: SignUpRequest) :Promise<APIResponseModel<AuthResponse>> {
    var url :string = API_URL + "/authentification/creer-compte";
    return axios.post(url,request, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        },
    })
} 

export async function logIn(request: LogInRequest) :Promise<APIResponseModel<AuthResponse>> {
    var url :string = API_URL + "/authentification/login";
    return axios.post(url,request, {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        },
    })
} 