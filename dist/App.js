import { AppRoute } from './routes/AppRoute';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./helpers/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";
const msalInstance = new PublicClientApplication(msalConfig);
function App() {
    return (<MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <Layout>
          <AppRoute />  
        </Layout>
      </BrowserRouter>
    </MsalProvider>);
}
export default App;
