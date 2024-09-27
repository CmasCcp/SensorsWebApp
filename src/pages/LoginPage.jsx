// src/Login.js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../helpers/authConfig";
import { Link } from 'react-router-dom'

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
            <Link to="#" className="nav-link text-customdark" onClick={handleLogin}>
                INGRESAR            
            </Link>
    );
}

export default LoginPage;