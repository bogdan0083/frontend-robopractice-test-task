import React from 'react'

import App from './App'

import 'antd/dist/antd.css'
import '../styles/globals.css'

import {createRoot} from 'react-dom/client'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
