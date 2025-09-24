import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export const PruebaObservador = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Crea la conexión solo una vez
        const api = "http://localhost:8084";
        const socket = io(api);

        // Escucha mensajes
        socket.on("medicion_insertada", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // Limpia la conexión al desmontar
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log("Mensajes actualizados:", messages);
    }, [messages]);

    return (
        <div className='card p-4 m-4 col-12 mx-auto'>
            <h2 className='text-center'>WebSocket Listener</h2>
            <div>


                <h3 className='text-center'>Dispositivo ID: {messages[0]?.dispositivoId}</h3>
                <div className="card px-2 py-2 mb-3 col-3 mx-auto">
                    <div className="fs-2 fw-bold text-center">
                        <b>Última fecha recibida:</b>
                    </div>
                    <div className="card-body text-center">

                        <p>
                            {messages.length > 0 ? messages[messages.length - 1].fecha : "Sin datos"}
                        </p>
                    </div>
                </div>
                <div className="card col-8 mx-auto">


                    <h5 className='text-center'>Últimas mediciones recibidas</h5>
                    <div className="container">

                        {messages.slice().reverse().map((msg, idx) => (
                            <>
                                <div key={idx} className='card col-9 mx-auto text-center'>{JSON.stringify(msg.fecha).replace(/"/g, '')}</div>
                            </>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};