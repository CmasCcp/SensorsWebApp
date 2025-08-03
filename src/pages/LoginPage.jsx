import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Dropdown, Form, Button, Modal } from "react-bootstrap";
import { MsalContext } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import * as config from "../helpers/config";

const LoginPage = () => {
    const msalContext = useContext(MsalContext);
    const [userEmail, setUserEmail] = useState(null);
    const [showVisitorLogin, setShowVisitorLogin] = useState(false); // Estado para el modal de visitante
    const [username, setUsername] = useState(""); // Estado para username
    const [password, setPassword] = useState(""); // Estado para password
    const [errorMessage, setErrorMessage] = useState(""); // Estado para mostrar el error de login
    const msalInstance = msalContext.instance;
    const msalAccounts = msalContext.accounts;
    const msalInProgress = msalContext.inProgress;
    const isAuthenticated = msalAccounts.length > 0;
    const visitorLoggedIn = localStorage.getItem("visitorLoggedIn") === "true";

    useEffect(() => {
        if (msalContext.accounts.length > 0) {
            const currentAccount = msalContext.accounts[0];
            setUserEmail(currentAccount.username);
        }
    }, [msalContext.accounts]);

    const handleLogin = () => {
        const loginRequest = {
            scopes: config.scopeBase,
            account: msalAccounts[0],
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

    const handleLoginVisitante = () => {
        setShowVisitorLogin(true); // Muestra el formulario de login para visitante
    };

    const handleLogout = () => {
    
        if(isAuthenticated){
            msalInstance.logoutRedirect();
        }else{
            localStorage.removeItem("visitorLoggedIn");
        }
    
        window.location.reload();
    };

    const handleVisitorLoginSubmit = (e) => {
        e.preventDefault();
        
        // Validación simple de las credenciales
        if (username === "admin" && password === "admin") {
            setErrorMessage(""); // Limpiar mensaje de error
            setShowVisitorLogin(false); // Cerrar el modal
            localStorage.setItem("visitorLoggedIn", "true");
            window.location.reload();
            // alert("¡Bienvenido, visitante!");
        } else {
            setErrorMessage("Credenciales incorrectas, por favor intente de nuevo.");
        }
    };

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle as="span" className="nav-link text-customdark" style={{ cursor: "pointer" }}>
                    {visitorLoggedIn ? "USUARIO INVITADO" : userEmail || "INGRESAR"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {userEmail || visitorLoggedIn ? (
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    ) : (
                        <>
                            <Dropdown.Item onClick={handleLogin}>Ingresar como administrador</Dropdown.Item>
                            <Dropdown.Item onClick={handleLoginVisitante}>Ingresar como visitante</Dropdown.Item>
                        </>
                    )}
                </Dropdown.Menu>
            </Dropdown>

            {/* Modal para login de visitante */}
            <Modal show={showVisitorLogin} onHide={() => setShowVisitorLogin(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ingresar como visitante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleVisitorLoginSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                        <Button variant="dark" type="submit">
                            Ingresar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginPage;
