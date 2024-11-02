import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { MsalContext } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import * as config from "../helpers/config";

const LoginPage = () => {
    const msalContext = useContext(MsalContext);
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem("userEmail") || null);
    const msalInstance = msalContext.instance;
    const msalAccounts = msalContext.accounts;
    const msalInProgress = msalContext.inProgress;
    const isAuthenticated = msalAccounts.length > 0;

    const handleLogin = () => {
        const loginRequest = {
            scopes: config.scopeBase,
            account: msalAccounts[0],
            prompt: 'login'
        };

        if (!isAuthenticated && msalInProgress === InteractionType.None) {
            msalInstance.loginRedirect(loginRequest);
        } else if (isAuthenticated && msalInProgress === InteractionType.None) {
            msalInstance.acquireTokenSilent(loginRequest)
                .then((response) => {
                    const accessToken = response.accessToken;
                    setUserEmail(msalAccounts[0].username);
                    sessionStorage.setItem("embedToken", accessToken);
                })
                .catch((error) => {
                    if (["consent_required", "interaction_required", "login_required"].includes(error.errorCode)) {
                        msalInstance.acquireTokenRedirect(loginRequest);
                    }
                });
        }
    };

    return userEmail ? (
        <span className="nav-link text-customdark">{userEmail}</span>
    ) : (
        <Link to="#" className="nav-link text-customdark" onClick={handleLogin}>
            INGRESAR
        </Link>
    );
};

export default LoginPage;