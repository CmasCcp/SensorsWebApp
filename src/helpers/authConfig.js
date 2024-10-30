// src/authConfig.js
export const msalConfig = {
    auth: {
        clientId: "fd9f480c-a4e3-4ad6-9250-f8ad25231a60", // Reemplaza con tu ID de cliente
        authority: "https://login.microsoftonline.com/b5d78927-25d0-44a9-8370-d86e57c7ba96", // Para cuentas personales y de trabajo/educativas
        redirectUri: import.meta.env.VITE_REDIRECT_URI, // Cambia al URI de redirección de tu aplicación
    },         
    cache: {
        cacheLocation: "sessionStorage", // Puedes usar 'localStorage' si prefieres
        storeAuthStateInCookie: false, // Configuración recomendada para IE11
    }
};

export const loginRequest = {
    scopes: [
        "User.Read"
    ], // Los permisos que estás solicitando
    prompt: "login"
};
