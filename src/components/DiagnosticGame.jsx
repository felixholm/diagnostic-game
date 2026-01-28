import React, { useState, useEffect, useRef } from 'react'
import ChatHistory from './ChatHistory'
import ActionPanel from './ActionPanel'
import DiagnosisPanel from './DiagnosisPanel'

function DiagnosticGame({ caseData, onBackToMenu }) {
  const [probabilities, setProbabilities] = useState({})
  const [history, setHistory] = useState([])
  const [usedActions, setUsedActions] = useState(new Set())
  const [totalCost, setTotalCost] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [panelHeight, setPanelHeight] = useState(280)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const initial = {}
    caseData.diagnoses.forEach(d => {
      initial[d.id] = d.prior_probability
    })
    setProbabilities(initial)
    setHistory([{
      type: 'system',
      content: caseData.patient_presentation.initial_description
    }])
    setUsedActions(new Set())
    setTotalCost(0)
    setGameOver(false)
    setSelectedDiagnosis(null)
    setShowFeedback(false)
  }

  // Bayesian probability update
  const updateProbabilities = (lrs) => {
    setProbabilities(prev => {
      const newProbs = {}
      let total = 0

      Object.keys(prev).forEach(id => {
        const lr = lrs[id] || 1
        newProbs[id] = prev[id] * lr
        total += newProbs[id]
      })

      // Normalize to sum to 1
      Object.keys(newProbs).forEach(id => {
        newProbs[id] = newProbs[id] / total
      })

      return newProbs
    })
  }

  const handleAction = (action) => {
    if (usedActions.has(action.id) || gameOver) return

    setUsedActions(prev => new Set([...prev, action.id]))
    setTotalCost(prev => prev + action.cost)

    // Add question and answer to history
    setHistory(prev => [
      ...prev,
      {
        type: 'question',
        content: action.question,
        cost: action.cost,
        actionType: action.type,
        action
      },
      {
        type: 'answer',
        content: action.answer,
        action
      }
    ])

    // Update probabilities with slight delay for visual effect
    setTimeout(() => {
      updateProbabilities(action.lr)
    }, 300)
  }

  const handleDiagnose = (diagnosisId) => {
    setSelectedDiagnosis(diagnosisId)
    setGameOver(true)

    const isCorrect = diagnosisId === caseData.true_diagnosis
    const diagnosisName = caseData.diagnoses.find(d => d.id === diagnosisId).name
    const trueDiagnosisName = caseData.diagnoses.find(d => d.id === caseData.true_diagnosis).name

    setHistory(prev => [
      ...prev,
      {
        type: 'diagnosis',
        content: `Final Diagnosis: ${diagnosisName}`,
        correct: isCorrect
      },
      {
        type: 'result',
        content: isCorrect
          ? `\u2713 Correct! The patient has ${trueDiagnosisName}.`
          : `\u2717 Incorrect. The actual diagnosis was ${trueDiagnosisName}.`,
        correct: isCorrect
      }
    ])
  }

  const handleDragStart = (e) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = panelHeight

    const onMouseMove = (e) => {
      const delta = startY - e.clientY
      setPanelHeight(Math.max(100, Math.min(window.innerHeight - 200, startHeight + delta)))
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left Panel - Chat Interface */}
      <div className="flex-1 flex flex-col border-r border-gray-700 min-w-0">
        <ChatHistory history={history} diagnoses={caseData.diagnoses} />
        {/* Resize handle */}
        <div
          className="h-1.5 bg-gray-700 hover:bg-blue-500 cursor-row-resize transition-colors shrink-0"
          onMouseDown={handleDragStart}
        />
        <div style={{ height: panelHeight }} className="shrink-0">
          <ActionPanel
            actions={caseData.actions}
            usedActions={usedActions}
            onAction={handleAction}
            gameOver={gameOver}
            onBackToMenu={onBackToMenu}
            diagnoses={caseData.diagnoses}
          />
        </div>
      </div>

      {/* Right Panel - Diagnosis Probabilities */}
      <DiagnosisPanel
        diagnoses={caseData.diagnoses}
        probabilities={probabilities}
        trueDiagnosis={caseData.true_diagnosis}
        selectedDiagnosis={selectedDiagnosis}
        totalCost={totalCost}
        gameOver={gameOver}
        onDiagnose={handleDiagnose}
        feedback={caseData.educational_feedback}
        showFeedback={showFeedback}
        onToggleFeedback={() => setShowFeedback(!showFeedback)}
        history={history}
      />
    </div>
  )
}

export default DiagnosticGame
