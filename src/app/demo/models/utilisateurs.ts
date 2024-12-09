export interface CreateUserRequest {
    region: string;
    username: string;
    forename: string;
    password: string;
    lastname: string;
    email: string;
    role: string;
    userType: string;
  }

export interface Utilisateur {
    [x: string]: any;
    id?: number;
    nom?: string;
    prenom?:string;
    titre_honorifique?: string;
    email?: string;
    tel?: number,
    matricule?:string
    region?:string
    actif?: boolean;

    username?: string;
    forename?: string;
    lastname?: string;
    role?: string;
    userType?: string;
    password?: string;

}
export interface Company{
    name?: string;
    ifu?: string;
    address?:string;
}
export interface User {
    id?: number;
    username?: string;
    lastname?:string;
    role?: string;
    email?: string;
    company?: Company;
    cnssNumber?:string;
    region?:string;
    actif?: boolean;
}


export interface UserResponse {
    content: User[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    last: boolean;
    first: boolean;
}
