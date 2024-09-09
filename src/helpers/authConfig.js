// src/authConfig.js
export const msalConfig = {
    auth: {
        clientId: "b348e54d-583a-4bb7-9444-ba00b058d887", // Reemplaza con tu ID de cliente
        authority: "https://login.microsoftonline.com/common", // Para cuentas personales y de trabajo/educativas
        redirectUri: "http://localhost:5173", // Cambia al URI de redirección de tu aplicación
    },         
    cache: {
        cacheLocation: "sessionStorage", // Puedes usar 'localStorage' si prefieres
        storeAuthStateInCookie: false, // Configuración recomendada para IE11
    }
};

export const loginRequest = {
    scopes: ["User.Read"] // Los permisos que estás solicitando
};
