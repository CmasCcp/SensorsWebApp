import React, { useEffect } from "react";
import { AppRoute } from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { MsalProvider} from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import {msalInstance} from './helpers/authConfig';

function App() {
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
