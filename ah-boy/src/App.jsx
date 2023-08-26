import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import Home from './Screens/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  )
}

export default App
