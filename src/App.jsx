import React, { useState } from 'react'
import TitleScreen from './components/TitleScreen'
import DiagnosticGame from './components/DiagnosticGame'
import dizziness001 from './data/cases/dizziness_001.json'
import headache001 from './data/cases/headache_001.json'

const CASES = [dizziness001, headache001]

function App() {
  const [screen, setScreen] = useState('title')
  const [selectedCase, setSelectedCase] = useState(null)

  const handleStartCase = (caseData) => {
    setSelectedCase(caseData)
    setScreen('game')
  }

  const handleBackToMenu = () => {
    setScreen('title')
    setSelectedCase(null)
  }

  if (screen === 'game' && selectedCase) {
    return <DiagnosticGame caseData={selectedCase} onBackToMenu={handleBackToMenu} />
  }

  return <TitleScreen cases={CASES} onStartCase={handleStartCase} />
}

export default App
