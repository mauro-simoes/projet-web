export interface User {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    password: string
    avatar: string,
    note: number,
    accountStatus: string,
    balance:number,
    role:string
}

export interface PasswordChangeRequest {
    currentPassword: string
    newPassword : string
}

export interface AdminPasswordChangeRequest {
    id: number
    newPassword : string
}