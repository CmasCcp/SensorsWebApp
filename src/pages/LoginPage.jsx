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
            })
            .catch(error => {
                // Maneja el error
                console.error("Error de autenticación:", error);
            });
    };

    return (
        <div>
            <h2>Iniciar sesión con Microsoft</h2>
            <button onClick={handleLogin}>
                Iniciar sesión
            </button>
        </div>
    );
}

export default LoginPage;
