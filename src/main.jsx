import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import { OrugaApp } from './OrugaApp.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <OrugaApp />
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
