import { AppRoute } from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './layout/Layout'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <AppRoute />  
      </Layout>
    </BrowserRouter>
  )
}

export default App
