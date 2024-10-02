// src/authConfig.js
export const msalConfig = {
    auth: {
        clientId: "61c007e7-7036-4b52-9156-0394c2b31132", // Reemplaza con tu ID de cliente
        authority: "https://login.microsoftonline.com/common", // Para cuentas personales y de trabajo/educativas
        redirectUri: "https://sensores.cmasccp.cl", // Cambia al URI de redirección de tu aplicación
    },         
    cache: {
        cacheLocation: "sessionStorage", // Puedes usar 'localStorage' si prefieres
        storeAuthStateInCookie: false, // Configuración recomendada para IE11
    }
};

export const loginRequest = {
    scopes: ["User.Read"] // Los permisos que estás solicitando
};
