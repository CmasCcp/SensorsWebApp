import React, { useContext, useEffect, useState } from "react";
import { AppRoute } from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { MsalProvider, MsalContext  } from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import {msalInstance} from './helpers/authConfig';

function App() {
  useEffect(() => {
      const eventCallback = msalInstance.addEventCallback((message) => {
          if (message.eventType === EventType.LOGIN_SUCCESS) {
              const payload = message.payload;
              const accessToken = payload.accessToken;
              const userEmail = payload.account.username;
              sessionStorage.setItem('embedToken', accessToken);
              sessionStorage.setItem('userEmail', userEmail);
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
