export interface User {
    [x: string]: any;
    id?: number;
    nom?: string;
    prenom?:string;
    email?: string;
    tel?: number,
    matricule?:string
    actif?: boolean;
}