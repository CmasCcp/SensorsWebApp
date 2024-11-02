import * as config from './config';
import { PublicClientApplication } from "@azure/msal-browser";

// src/authConfig.js
const msalConfig = {
    auth: {
        clientId: config.clientId, // Reemplaza con tu ID de cliente
        authority: config.authorityUrl, // Para cuentas personales y de trabajo/educativas
        redirectUri: import.meta.env.VITE_REDIRECT_URI, // Cambia al URI de redirección de tu aplicación
    },         
    cache: {
        cacheLocation: "sessionStorage", // Puedes usar 'localStorage' si prefieres
        storeAuthStateInCookie: false, // Configuración recomendada para IE11
    }
};

export const msalInstance = new PublicClientApplication(msalConfig);
