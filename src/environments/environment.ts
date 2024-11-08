// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
    production: false,
    projectName: 'GUMP V1',
    projectSigle: 'GUMP',
    version: '0.1.1',
};

const host_ms_drtss = 'http://localhost:8082/api';
const host_gateway = '';
/** @type {*} */
export const API_ROOT = {
    /**
     * API SIGNATURE ELECTRONIQUE
     */

    API_CREATE_SIGNATAIRE_DRTSS: `${host_ms_drtss}/signature_electronique/create_signataire`,
    API_DOWNLOAD_SIGNATAIRE_CERTIFICAT_DRTSS: `${host_ms_drtss}/signature_electronique/download_certificate`,
    API_SIGNE_ATTESTATION_DRTSS: `${host_ms_drtss}/signature_electronique/sign_attestation`,
    API_LISTE_USERS_SIGNATAIRE_DRTSS: `${host_ms_drtss}/signature_electronique/liste_signataire`,
    API_LISTE_USERS_DRTSS: `${host_ms_drtss}/utilisateur_drtss/liste`,
    API_CREATE_USERS_DRTSS: `${host_ms_drtss}/utilisateur_drtss/save`,

    /**
     * API DEMANDE
     */

    API_LISTE_DEMANDES: `${host_ms_drtss}/demandes`,



};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
