export interface ApiBodyRequestLogin {
  email: string;
  password: string;
}

export interface ApiResponseUser {
  name: string;
  company_name: string | null;
  nit: string;
  dv: string;
}

export interface ApiResponseLogin {
  accessToken: `${string}.${string}.${string}`;
  refreshToken: `${string}.${string}.${string}`;
  user: ApiResponseUser;
}

export interface ContractUserLogin {
  idRol: number;
  idUsuario: number;
  nombreCompleto: string;
  correoElectronico: string;
  permisos: string[];
  usuario: string;
}

export interface ContractLogin {
  accessToken: `${string}.${string}.${string}`;
  refreshToken: `${string}.${string}.${string}`;
  user: ContractUserLogin;
}
