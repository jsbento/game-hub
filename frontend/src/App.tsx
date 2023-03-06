import { useState } from 'react'
import './App.css'
import Chat from './components/Chat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Chat />
    </div>
  )
}

export default App
