import React, { useState, useCallback, useRef } from 'react'
import DiagnosisTooltip from './DiagnosisTooltip'

const CRITICAL_THRESHOLD = 0.10

function DiagnosisPanel({
  diagnoses,
  probabilities,
  trueDiagnosis,
  selectedDiagnosis,
  totalCost,
  gameOver,
  onDiagnose,
  feedback,
  showFeedback,
  onToggleFeedback,
  history
}) {
  const [hoveredDiagnosisId, setHoveredDiagnosisId] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const hideTimeoutRef = useRef(null)

  const [hoveredDangerId, setHoveredDangerId] = useState(null)
  const [dangerTooltipPosition, setDangerTooltipPosition] = useState({ top: 0, left: 0 })
  const dangerHideTimeoutRef = useRef(null)

  // Sort: critical diagnoses above threshold first, then by probability
  const sortedDiagnoses = [...diagnoses].sort((a, b) => {
    const probA = probabilities[a.id] || 0
    const probB = probabilities[b.id] || 0
    const aCrit = a.critical && probA >= CRITICAL_THRESHOLD
    const bCrit = b.critical && probB >= CRITICAL_THRESHOLD
    if (aCrit !== bCrit) return aCrit ? -1 : 1
    return probB - probA
  })

  const highestProb = Math.max(...Object.values(probabilities))

  // --- Findings tooltip handlers ---
  const handleInfoHover = useCallback((e, diagnosisId) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipWidth = 320
    const tooltipHeight = 300

    let left = rect.left - tooltipWidth - 8
    if (left < 8) {
      left = rect.right + 8
    }

    let top = rect.top - 8
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - 16
    }
    if (top < 8) top = 8

    setTooltipPosition({ top, left })
    setHoveredDiagnosisId(diagnosisId)
  }, [])

  const handleInfoLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredDiagnosisId(null)
    }, 150)
  }, [])

  const handleTooltipEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  const handleTooltipLeave = useCallback(() => {
    setHoveredDiagnosisId(null)
  }, [])

  // --- Danger tooltip handlers ---
  const handleDangerHover = useCallback((e, diagnosisId) => {
    if (dangerHideTimeoutRef.current) {
      clearTimeout(dangerHideTimeoutRef.current)
      dangerHideTimeoutRef.current = null
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipWidth = 320
    const tooltipHeight = 150

    let left = rect.left - tooltipWidth - 8
    if (left < 8) {
      left = rect.right + 8
    }

    let top = rect.top - 8
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - 16
    }
    if (top < 8) top = 8

    setDangerTooltipPosition({ top, left })
    setHoveredDangerId(diagnosisId)
  }, [])

  const handleDangerLeave = useCallback(() => {
    dangerHideTimeoutRef.current = setTimeout(() => {
      setHoveredDangerId(null)
    }, 150)
  }, [])

  const handleDangerTooltipEnter = useCallback(() => {
    if (dangerHideTimeoutRef.current) {
      clearTimeout(dangerHideTimeoutRef.current)
      dangerHideTimeoutRef.current = null
    }
  }, [])

  const handleDangerTooltipLeave = useCallback(() => {
    setHoveredDangerId(null)
  }, [])

  const hoveredDangerDiagnosis = hoveredDangerId
    ? diagnoses.find(d => d.id === hoveredDangerId)
    : null

  return (
    <div className="w-80 flex flex-col bg-gray-800/30 min-w-[320px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Differential Diagnosis</h2>
        <div className="flex justify-between items-center mt-2">
          <span className="text-base text-gray-400">
            Time: <span className="text-yellow-500 font-medium">{totalCost} min</span>
          </span>
          {highestProb >= 0.9 && !gameOver && (
            <span className="text-sm text-green-400 animate-pulse">
              High confidence reached!
            </span>
          )}
        </div>
      </div>

      {/* Probability Bars */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sortedDiagnoses.map(diagnosis => {
          const prob = probabilities[diagnosis.id] || 0
          const isCorrect = diagnosis.id === trueDiagnosis
          const isSelected = diagnosis.id === selectedDiagnosis
          const isHighest = prob === highestProb && prob > 0
          const isCriticalHighlighted = diagnosis.critical && prob >= CRITICAL_THRESHOLD

          return (
            <div
              key={diagnosis.id}
              className={`space-y-2 transition-all ${
                isCriticalHighlighted
                  ? 'border border-red-500/50 rounded-lg p-2 bg-red-500/5'
                  : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-base font-medium flex items-center gap-2
                  ${gameOver && isCorrect ? 'text-green-400' : 'text-gray-200'}`}>
                  {diagnosis.name}
                  {gameOver && isCorrect && (
                    <span className="text-green-500">&#10003;</span>
                  )}
                  {gameOver && isSelected && !isCorrect && (
                    <span className="text-red-500">&#10007;</span>
                  )}
                  {diagnosis.critical && (
                    <DangerIcon
                      id={diagnosis.id}
                      pulse={isCriticalHighlighted}
                      onHover={handleDangerHover}
                      onLeave={handleDangerLeave}
                    />
                  )}
                  <InfoIcon
                    id={diagnosis.id}
                    onHover={handleInfoHover}
                    onLeave={handleInfoLeave}
                  />
                </span>
                <span className={`text-base font-mono
                  ${prob >= 0.9 ? 'text-green-400 font-bold' :
                    prob >= 0.5 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {(prob * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-8 bg-gray-700 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max(prob * 100, 2)}%`,
                    backgroundColor: diagnosis.color,
                    boxShadow: prob >= 0.5 ? `0 0 15px ${diagnosis.color}40` : 'none'
                  }}
                >
                  {prob >= 0.15 && (
                    <span className="text-sm font-bold text-white/90 drop-shadow">
                      {(prob * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Threshold marker at 90% */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-green-500/50"
                  style={{ left: '90%' }}
                />
              </div>

              {/* Diagnose button */}
              {!gameOver && (
                <button
                  onClick={() => onDiagnose(diagnosis.id)}
                  disabled={gameOver}
                  className={`w-full py-2 text-sm font-medium rounded-lg transition-all
                    ${prob >= 0.9
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                      : prob >= 0.5
                        ? 'bg-yellow-600/80 hover:bg-yellow-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                >
                  {prob >= 0.9 ? '\u2713 Diagnose (High Confidence)' :
                   prob >= 0.5 ? 'Diagnose (Moderate)' : 'Diagnose (Low)'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Educational Tips / Score */}
      <div className="border-t border-gray-700">
        {!gameOver ? (
          <div className="p-4 bg-gray-800/50">
            <p className="text-sm text-gray-400 leading-relaxed">
              <span className="text-blue-400 font-medium">{'\uD83D\uDCA1'} Strategy:</span> History questions are quick (1 min){'\u2014'}start there.
              Physical exams are fast and often diagnostic. Avoid lengthy lab tests and imaging unless needed.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gray-800/50 space-y-3">
            {/* Educational Feedback Toggle */}
            <button
              onClick={onToggleFeedback}
              className="w-full mt-2 py-2 text-sm bg-blue-600/20 hover:bg-blue-600/30
                         text-blue-400 rounded-lg transition-colors"
            >
              {showFeedback ? 'Hide' : 'Show'} Clinical Pearls
            </button>

            {showFeedback && feedback && feedback[trueDiagnosis] && (
              <div className="mt-3 p-3 bg-gray-900/50 rounded-lg text-sm space-y-2">
                <p className="font-medium text-green-400">Key Findings:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {feedback[trueDiagnosis].key_findings.map((finding, i) => (
                    <li key={i}>{finding}</li>
                  ))}
                </ul>
                <p className="pt-2 border-t border-gray-700 text-gray-400 italic">
                  {feedback[trueDiagnosis].clinical_pearl}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Findings tooltip */}
      {hoveredDiagnosisId && history && (
        <DiagnosisTooltip
          diagnosisId={hoveredDiagnosisId}
          diagnoses={diagnoses}
          history={history}
          position={tooltipPosition}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        />
      )}

      {/* Danger tooltip */}
      {hoveredDangerDiagnosis && hoveredDangerDiagnosis.critical && (
        <div
          className="fixed z-50 w-80 bg-gray-800 border border-red-500/50 rounded-lg shadow-xl p-3"
          style={{ top: dangerTooltipPosition.top, left: dangerTooltipPosition.left }}
          onMouseEnter={handleDangerTooltipEnter}
          onMouseLeave={handleDangerTooltipLeave}
        >
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">
            {'\u26A0'} {hoveredDangerDiagnosis.critical.label}
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {hoveredDangerDiagnosis.critical.reason}
          </p>
        </div>
      )}
    </div>
  )
}

function InfoIcon({ id, onHover, onLeave }) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-500
                 text-gray-400 hover:text-blue-400 hover:border-blue-400 cursor-help
                 transition-colors text-xs font-serif leading-none shrink-0"
      onMouseEnter={(e) => onHover(e, id)}
      onMouseLeave={onLeave}
    >
      i
    </span>
  )
}

function DangerIcon({ id, pulse, onHover, onLeave }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 text-red-400 cursor-help
                  transition-colors text-sm leading-none shrink-0
                  ${pulse ? 'animate-pulse' : ''}`}
      onMouseEnter={(e) => onHover(e, id)}
      onMouseLeave={onLeave}
    >
      {'\u26A0'}
    </span>
  )
}

export default DiagnosisPanel
