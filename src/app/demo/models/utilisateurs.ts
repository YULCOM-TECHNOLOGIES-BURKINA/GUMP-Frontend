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