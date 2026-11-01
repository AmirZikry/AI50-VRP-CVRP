import { useState } from 'react'
import ResultsTable from './components/ResultTable'
import { Navbar } from './components/navbar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <ResultsTable></ResultsTable>
      
    </>
  )
}

export default App
