import { useState } from 'react'
import ResultsTable from './components/ResultTable'
import {Card} from './components/Card'
import { Navbar } from './components/navbar'
import './App.css'

function App() {

  return (
    <>
    <Navbar/>
    <Card size='large' mainText='Benchmark Results' secondaryText='Same time budget, mean over seeds'>
    <ResultsTable></ResultsTable>
    </Card>
      
    </>
  )
}

export default App
