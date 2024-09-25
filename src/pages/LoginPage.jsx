// src/Login.js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../helpers/authConfig";

function LoginPage() {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .then(response => {
                // Maneja la respuesta, el usuario está autenticado
                console.log("Usuario autenticado:", response.account);
                console.log("Token:", response.accessToken);
                console.log("Expira en:", response.expiresOn);
            })
            .catch(error => {
                // Maneja el error
                console.error("Error de autenticación:", error);
            });
    };

    return (
            <button className="bg-customprimary text-white btn" onClick={handleLogin}>
                Acceder
            </button>
    );
}

export default LoginPage;
