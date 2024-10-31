// src/Login.js
import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../helpers/authConfig";
import { Link } from 'react-router-dom';

  async function generatePowerBIToken(accessToken) {
    const url = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const dataset_id = 'e34f3aa7-d9b9-45c5-a050-3fde4f9caecb';
    const report_id = 'af0cd53d-4c4b-4ce8-b6d8-f7d85483408e';
    const workspace_id = '869a590a-0426-48e3-8c31-ea20c5e79c6c';
  
    const body = {
      datasets: [{ id: dataset_id }],
      reports: [{ id: report_id }],
      targetWorkspaces: [{ id: workspace_id }]
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Token de incrustación generado:', data.token);
        return data.token; // Devuelve el token de incrustación
      } else {
        throw new Error('Error al generar el token de incrustación');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

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
                console.log("Token de Login: ",response.accessToken);
                console.log("Usuario autenticado:", response.account);
                setUserEmail(response.account.username); // Establecer el correo del usuario autenticado
                instance.acquireTokenSilent({
                    scopes: ["https://analysis.windows.net/powerbi/api/.default"],
                    account: response.account
                  }).then(tokenResponse => {
                    console.log("Token de PBI: ",tokenResponse.accessToken);
                    const PbiToken = generatePowerBIToken(tokenResponse.accessToken)
                    console.log(PbiToken);
                    localStorage.setItem('embedToken', PbiToken);
                  }).catch(error => {
                    console.error("Error al obtener el token de Power BI:", error);
                  });
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
