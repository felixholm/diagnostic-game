import React from 'react'

function TitleScreen({ cases, onStartCase }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-12 px-6 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Diagnostic Reasoning</h1>
          <p className="text-lg text-gray-400">
            Practice clinical decision-making with Bayesian probability
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">How to Play</h2>
          <div className="space-y-3 text-base text-gray-300 leading-relaxed">
            <p>
              You are presented with a patient. Your goal is to identify the correct
              diagnosis by gathering clinical information efficiently.
            </p>
            <ul className="space-y-2 list-none">
              <li className="flex gap-3">
                <span className="text-blue-400 shrink-0">{'\uD83D\uDCAC'}</span>
                <span><span className="text-white font-medium">History</span> {'\u2014'} Ask the patient questions. Quick (1 min each).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 shrink-0">{'\uD83E\uDE7A'}</span>
                <span><span className="text-white font-medium">Physical Exam</span> {'\u2014'} Perform bedside tests. Fast (1{'\u2013'}10 min).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 shrink-0">{'\uD83D\uDD2C'}</span>
                <span><span className="text-white font-medium">Diagnostic Tests</span> {'\u2014'} Order labs and imaging. Slow (10{'\u2013'}60 min).</span>
              </li>
            </ul>
            <p>
              Each action updates the probability bars using Bayesian reasoning.
              Watch for <span className="text-red-400 font-medium">{'\u26A0'} critical diagnoses</span> that
              must not be missed. When you are confident, select your final diagnosis.
            </p>
            <p className="text-gray-400 text-sm">
              Tip: Start with history, then targeted exams. Only order expensive tests
              when the clinical picture is unclear.
            </p>
          </div>
        </div>

        {/* Case Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Select a Case</h2>
          <div className="grid gap-4">
            {cases.map(caseData => (
              <div
                key={caseData.case_id}
                className="bg-gray-800 rounded-xl p-5 border border-gray-700
                           hover:border-blue-500/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-white">{caseData.title}</h3>
                    <p className="text-base text-gray-300">
                      {caseData.patient_presentation.age}-year-old {caseData.patient_presentation.sex} {'\u2014'} {caseData.patient_presentation.chief_complaint}
                    </p>
                    <p className="text-sm text-gray-500">
                      {caseData.diagnoses.length} diagnoses in differential {'\u00B7'} {caseData.actions.length} available actions
                    </p>
                  </div>
                  <button
                    onClick={() => onStartCase(caseData)}
                    className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white
                               font-medium rounded-lg transition-colors"
                  >
                    Start Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TitleScreen
