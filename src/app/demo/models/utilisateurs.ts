export interface Utilisateur {
    [x: string]: any;
    id?: number;
    nom?: string;
    prenom?:string;
    titre_honorifique?: string;
    email?: string;
    tel?: number,
    matricule?:string
    actif?: boolean;
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