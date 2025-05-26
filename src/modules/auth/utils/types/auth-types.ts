export interface ApiBodyRequestLogin {
  email: string
  password: string
}

export interface ApiResponseUser {
  name: string
  company_name: string | null
  nit: string
  dv: string
}

export interface ApiResponseLogin {
  accessToken: `${string}.${string}.${string}`
  refreshToken: `${string}.${string}.${string}`
  user: ApiResponseUser
}

export interface ContractUserLogin {
  name: string
  companyName: string | null
  nit: string
  dv: string
}

export interface ContractLogin {
  accessToken: `${string}.${string}.${string}`
  refreshToken: `${string}.${string}.${string}`
  user: ContractUserLogin
}
