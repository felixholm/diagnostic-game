import React from 'react'
import { getSingleInfluence, getSingleInfluenceColor } from '../utils/lrHelpers'

function DiagnosisTooltip({ diagnosisId, diagnoses, history, position, onMouseEnter, onMouseLeave }) {
  const diagnosis = diagnoses.find(d => d.id === diagnosisId)

  const answerItems = history.filter(item => item.type === 'answer' && item.action?.lr)

  const findings = answerItems.map(item => {
    const lrValue = item.action.lr[diagnosisId] || 1
    const influence = getSingleInfluence(lrValue)

    const matchedFinding = item.action.potential_findings?.find(pf => {
      const keys = Object.keys(item.action.lr)
      return keys.every(k => pf.lr[k] === item.action.lr[k])
    })

    return {
      name: matchedFinding ? matchedFinding.finding : item.action.answer,
      influence,
      color: getSingleInfluenceColor(influence)
    }
  })

  findings.sort((a, b) => {
    const order = { up: 0, neutral: 1, down: 2 }
    if (a.influence.direction !== b.influence.direction) {
      return order[a.influence.direction] - order[b.influence.direction]
    }
    return b.influence.strength - a.influence.strength
  })

  return (
    <div
      className="fixed z-50 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3"
      style={{ top: position.top, left: position.left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Findings Impact &mdash; {diagnosis?.name}
      </h4>
      {findings.length > 0 ? (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {findings.map((finding, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className={`shrink-0 w-8 text-right font-mono ${finding.color}`}>
                {finding.influence.arrows}
              </span>
              <span className="text-gray-200">{finding.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No findings collected yet.</p>
      )}
    </div>
  )
}

export default DiagnosisTooltip
