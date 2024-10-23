// src/Login.js
import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../helpers/authConfig";
import { Link } from 'react-router-dom';

function LoginPage() {
    const { instance, accounts } = useMsal();
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        if (accounts && accounts.length > 0) {
            setUserEmail(accounts[0].username);
        }
    }, [accounts]);

    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .then(response => {
                console.log("Usuario autenticado:", response.account);
                setUserEmail(response.account.username); // Establecer el correo del usuario autenticado
            })
            .catch(error => {
                console.error("Error de autenticación:", error);
            });
    };

    return userEmail ? (
        <span className="nav-link text-customdark">{userEmail}</span>
    ) : (
        <Link to="#" className="nav-link text-customdark" onClick={handleLogin}>
            INGRESAR
        </Link>
    );
}

export default LoginPage;
