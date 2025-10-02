import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export const PruebaObservador = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Crea la conexión solo una vez
        const api = `${import.meta.env.VITE_API_URL}`;
        const socket = io(api);

        socket.on('connect', () => {
            console.log('Conectado al WebSocket');
        });

        socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });

        socket.on("medicion_insertada", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log("Mensajes actualizados:", messages);
    }, [messages]);

    return (
        <div className='card p-4 m-4 col-12 mx-auto'>
            <h3 className='text-center'>WebSocket Listener <span className="badge badge-secondary">beta</span></h3>
            <div className="card mb-3 col-md-10 mx-auto p-0">
                <div className="accordion mb-0 w-100" id="descripcionAccordion">
                    <div className="accordion-item">
                        <button
                            className="w-100 accordion-button btn collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseDesc"
                            aria-expanded="false"
                            aria-controls="collapseDesc"
                        >
                            Sobre esta página
                        </button>
                        <div
                            id="collapseDesc"
                            className="accordion-collapse collapse p-5"
                            aria-labelledby="headingDesc"
                            data-bs-parent="#descripcionAccordion"
                        >
                            <div className="accordion-body">
                                <p className="card-text">
                                    Esta página sirve para monitorear en tiempo real las mediciones que llegan al servidor mediante WebSockets.
                                    Al entrar, se establece una conexión que escucha el evento <code>medicion_insertada</code> y muestra:
                                </p>
                                <ul>
                                    <li>Última fecha recibida.</li>
                                    <li>Listado de las últimas mediciones en orden inverso.</li>
                                    <li>Conteo de mensajes recibidos: <strong>{messages.length}</strong>.</li>
                                </ul>
                                <p className="text-muted mb-0">La conexión se mantiene activa mientras la página esté abierta y se cierra al salir.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-12 mx-auto'>


                <h3 className='text-center'>Dispositivo ID: {messages[0]?.dispositivoId}</h3>
                <div className="card px-2 py-1 mb-3 col-5 mx-auto">
                    <div className="fs-2 fw-bold text-center py-0">
                        <b>Última fecha recibida:</b>
                    </div>
                    <div className="card-body text-center p-1">

                        <p>
                            {messages.length > 0 ? messages[messages.length - 1].fecha : "Sin datos"}
                        </p>
                    </div>
                </div>
                <div className="card col-12 mx-0 px-0">


                    <h5 className='text-center'>Últimas mediciones recibidas</h5>
                    <div className="container">

                        {messages.slice().reverse().map((msg, idx) => (
                            <>
                                <div key={idx} className='card col-md-12 mx-auto text-center p-0'><small>{JSON.stringify(msg.fecha).replace(/"/g, '')} - dispositivo {msg.dispositivoId} - sensores {JSON.stringify(msg.sensorIds)} - valores {JSON.stringify(msg.valores)}</small></div>
                            </>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};