import React, { useEffect } from "react";
import { AppRoute } from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { MsalProvider} from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import {msalInstance} from './helpers/authConfig';

function App() {
  const obj = {"status": "success", "data": {"tableData": [{"fecha": "2024-10-24T04:17:56", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-03", "dispositivo_descripcion": "Medición en laboratorio", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.4877, "pH ambiental (pH)": 5.9502}, {"fecha": "2024-10-24T07:52:50", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 11.9754, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T08:09:57", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 11.9566, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T08:27:16", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0083, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T08:44:42", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0365, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T08:58:00", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0459, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T09:00:50", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0459, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T09:03:52", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0271, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T09:07:37", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0506, "pH ambiental (pH)": 14.0}, {"fecha": "2024-10-24T09:11:03", "id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": "", "id_proyecto": 1, "codigo_interno": "CMPC-02", "dispositivo_descripcion": "Medición río Biobío en Laja", "Electroconductividad ambiental (µS/cm)": 0.0, "Grados celcius (°C)": -127.0, "Humedad (%)": NaN, "Latitud (°)": NaN, "Longitud (°)": NaN, "Material particulado PM 2.5 (µg/m³)": NaN, "Miliamperios hora (mAh)": NaN, "Voltaje (V)": 12.0506, "pH ambiental (pH)": 14.0}], "tabla": "datos", "totalCount": 13246}}
  console.log(obj.data.tableData);
  
  useEffect(() => {
      const eventCallback = msalInstance.addEventCallback((message) => {
          if (message.eventType === EventType.LOGIN_SUCCESS) {
              const payload = message.payload;
              const accessToken = payload.accessToken;
              sessionStorage.setItem('embedToken', accessToken);
          }
      });

      return () => {
          msalInstance.removeEventCallback(eventCallback);
      };
  }, [msalInstance]);

  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <Layout>
          <AppRoute />  
        </Layout>
      </BrowserRouter>
    </MsalProvider>
  )
}

export default App
