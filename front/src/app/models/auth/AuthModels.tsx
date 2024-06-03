
export interface LogInRequest {
    email: string,
    password: string
}

export interface SignUpRequest {
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    password: string
}

export interface AuthResponse {
    token: string,
    role: string
}