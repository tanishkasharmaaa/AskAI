import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import ThemeSync from './config/ThemeSync'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ThemeSync/>
      <Navbar/>
    </>
  )
}

export default App
