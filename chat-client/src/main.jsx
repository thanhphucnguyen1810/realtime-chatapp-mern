import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import '~/index.css'
import App from '~/App'
import SettingsProvider from '~/contexts/SettingsContext'
import { store } from '~/redux/store'
// Cấu hình React-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <SettingsProvider>
          <BrowserRouter>
            <App />
            <ToastContainer position='bottom-left' theme='colored' />
          </BrowserRouter>
        </SettingsProvider>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>
)
