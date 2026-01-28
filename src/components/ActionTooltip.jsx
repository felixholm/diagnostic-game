import React from 'react'
import { getStrongestInfluences, getInfluenceColor } from '../utils/lrHelpers'

function ActionTooltip({ action, diagnoses, position }) {
  if (!action.potential_findings) return null

  return (
    <div
      className="fixed z-50 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3"
      style={{ top: position.top, left: position.left }}
    >
      {action.description && (
        <p className="text-sm text-gray-400 italic mb-2 leading-relaxed">
          {action.description}
        </p>
      )}
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Potential Findings
      </h4>
      <div className="space-y-2.5">
        {action.potential_findings.map((pf, idx) => {
          const influences = getStrongestInfluences(pf.lr)
          return (
            <div key={idx} className="text-sm">
              <p className="font-medium text-gray-200">{pf.finding}</p>
              {pf.description && (
                <p className="text-gray-500 mb-1 leading-snug">{pf.description}</p>
              )}
              {influences.length > 0 ? (
                <div className="flex flex-wrap gap-x-3 gap-y-1 pl-2">
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
          )
        })}
      </div>
    </div>
  )
}

export default ActionTooltip
