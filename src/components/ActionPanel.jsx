import React, { useState, useCallback } from 'react'
import ActionTooltip from './ActionTooltip'

function ActionPanel({ actions, usedActions, onAction, gameOver, onBackToMenu, diagnoses }) {
  const [activeTab, setActiveTab] = useState('history')
  const [hoveredActionId, setHoveredActionId] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  const tabs = [
    { id: 'history', label: 'History', icon: '\uD83D\uDCAC' },
    { id: 'exam', label: 'Exam', icon: '\uD83E\uDE7A' },
    { id: 'test', label: 'Tests', icon: '\uD83D\uDD2C' }
  ]

  const getAvailableActions = (type) => {
    return actions.filter(a => a.type === type && !usedActions.has(a.id))
  }

  const getUsedCount = (type) => {
    return actions.filter(a => a.type === type && usedActions.has(a.id)).length
  }

  const getTotalCount = (type) => {
    return actions.filter(a => a.type === type).length
  }

  const handleInfoHover = useCallback((e, actionId) => {
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
    setHoveredActionId(actionId)
  }, [])

  const hoveredAction = hoveredActionId
    ? actions.find(a => a.id === hoveredActionId)
    : null

  if (gameOver) {
    return (
      <div className="border-t border-gray-700 p-4 bg-gray-800/50 h-full flex items-center">
        <button
          onClick={onBackToMenu}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-base font-medium transition-colors"
        >
          Back to Cases
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-700 bg-gray-800/30 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 shrink-0">
        {tabs.map(tab => {
          const available = getAvailableActions(tab.id).length
          const used = getUsedCount(tab.id)
          const total = getTotalCount(tab.id)

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-base font-medium transition-colors relative
                ${activeTab === tab.id
                  ? 'bg-gray-700/50 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
              <span className={`ml-2 text-sm ${available === 0 ? 'text-gray-600' : 'text-gray-400'}`}>
                {used}/{total}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="p-3 flex-1 min-h-0 overflow-y-auto">
        <div className="grid gap-2">
          {getAvailableActions(activeTab).map(action => (
            <button
              key={action.id}
              onClick={() => onAction(action)}
              className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all
                         hover:translate-x-1 group border border-transparent hover:border-gray-600"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-base text-gray-200 group-hover:text-white flex-1">
                  {action.question}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {action.potential_findings && (
                    <span
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-500
                                 text-gray-400 hover:text-blue-400 hover:border-blue-400 cursor-help
                                 transition-colors text-sm font-serif leading-none"
                      onMouseEnter={(e) => {
                        e.stopPropagation()
                        handleInfoHover(e, action.id)
                      }}
                      onMouseLeave={() => setHoveredActionId(null)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      i
                    </span>
                  )}
                  <span className={`text-sm font-medium whitespace-nowrap px-2 py-0.5 rounded
                    ${action.cost <= 2
                      ? 'text-green-500 bg-green-500/10'
                      : action.cost <= 10
                        ? 'text-yellow-500 bg-yellow-500/10'
                        : 'text-orange-500 bg-orange-500/10'
                    }`}>
                    {action.cost} min
                  </span>
                </div>
              </div>
            </button>
          ))}

          {getAvailableActions(activeTab).length === 0 && (
            <p className="text-gray-500 text-base text-center py-6">
              All {activeTab === 'history' ? 'history questions' : activeTab === 'exam' ? 'exam maneuvers' : 'tests'} completed
            </p>
          )}
        </div>
      </div>

      {/* Tooltip rendered outside scrollable area */}
      {hoveredAction && diagnoses && (
        <ActionTooltip
          action={hoveredAction}
          diagnoses={diagnoses}
          position={tooltipPosition}
        />
      )}
    </div>
  )
}

export default ActionPanel
