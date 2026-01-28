import React, { useEffect, useRef, useState, useCallback } from 'react'
import ActionTooltip from './ActionTooltip'
import { getStrongestInfluences, getInfluenceColor } from '../utils/lrHelpers'

function ChatHistory({ history, diagnoses }) {
  const endRef = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleInfoHover = useCallback((e, id) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipWidth = 320
    const tooltipHeight = 200

    let left = rect.right + 8
    if (left + tooltipWidth > window.innerWidth) {
      left = rect.left - tooltipWidth - 8
    }

    let top = rect.top - 8
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - 16
    }
    if (top < 8) top = 8

    setTooltipPosition({ top, left })
    setHoveredId(id)
  }, [])

  const getMessageStyles = (item) => {
    const base = 'rounded-lg p-3 max-w-[85%]'

    switch (item.type) {
      case 'system':
        return `${base} bg-gray-800 border-l-4 border-blue-500 self-start`
      case 'question':
        return `${base} bg-blue-900/50 self-end`
      case 'answer':
        return `${base} bg-gray-800 self-start`
      case 'diagnosis':
        return `${base} bg-purple-900/50 border-l-4 border-purple-500 self-center w-full`
      case 'result':
        return `${base} ${item.correct ? 'bg-green-900/50 border-l-4 border-green-500' : 'bg-red-900/50 border-l-4 border-red-500'} self-center w-full`
      default:
        return base
    }
  }

  const getTypeLabel = (actionType) => {
    switch (actionType) {
      case 'history': return 'History'
      case 'exam': return 'Physical Exam'
      case 'test': return 'Diagnostic Test'
      default: return actionType
    }
  }

  const hoveredItem = hoveredId !== null
    ? history.find((_, idx) => idx === hoveredId)
    : null

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-3">
        {history.map((item, idx) => (
          <div key={idx} className={getMessageStyles(item)}>
            {item.type === 'question' && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <span className="uppercase font-medium">{getTypeLabel(item.actionType)}</span>
                {item.cost > 0 && (
                  <span className="text-yellow-500 font-medium">
                    {item.cost} min
                  </span>
                )}
                {item.action?.potential_findings && diagnoses && (
                  <InfoIcon
                    id={idx}
                    onHover={handleInfoHover}
                    onLeave={() => setHoveredId(null)}
                  />
                )}
              </div>
            )}
            {item.type === 'answer' && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="uppercase">Patient Response</span>
                {item.action?.lr && diagnoses && (
                  <InfoIcon
                    id={idx}
                    onHover={handleInfoHover}
                    onLeave={() => setHoveredId(null)}
                  />
                )}
              </div>
            )}
            <p className="text-base leading-relaxed">{item.content}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Tooltip for question: show potential findings */}
      {hoveredItem && hoveredItem.type === 'question' && hoveredItem.action && diagnoses && (
        <ActionTooltip
          action={hoveredItem.action}
          diagnoses={diagnoses}
          position={tooltipPosition}
        />
      )}

      {/* Tooltip for answer: show actual finding influences */}
      {hoveredItem && hoveredItem.type === 'answer' && hoveredItem.action && diagnoses && (
        <AnswerTooltip
          action={hoveredItem.action}
          diagnoses={diagnoses}
          position={tooltipPosition}
        />
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

function AnswerTooltip({ action, diagnoses, position }) {
  const influences = getStrongestInfluences(action.lr)

  // Match actual finding to a potential_finding by comparing LR objects
  const matchedFinding = action.potential_findings?.find(pf => {
    const keys = Object.keys(action.lr)
    return keys.every(k => pf.lr[k] === action.lr[k])
  })

  return (
    <div
      className="fixed z-50 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3"
      style={{ top: position.top, left: position.left }}
    >
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Actual Finding
      </h4>
      <div className="text-sm">
        <p className="font-medium text-gray-200">
          {matchedFinding ? matchedFinding.finding : action.answer}
        </p>
        {matchedFinding?.description && (
          <p className="text-gray-500 mb-1 leading-snug">{matchedFinding.description}</p>
        )}
        {influences.length > 0 ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1 pl-2 mt-1">
            {influences.map(inf => {
              const dx = diagnoses.find(d => d.id === inf.dxId)
              return (
                <span key={inf.dxId} className={`whitespace-nowrap ${getInfluenceColor(inf)}`}>
                  {inf.arrows} {dx ? dx.name : inf.dxId}
                </span>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 pl-2">Minimal diagnostic impact</p>
        )}
      </div>
    </div>
  )
}

export default ChatHistory
