# Diagnostic Reasoning Game

An educational game teaching clinical diagnostic reasoning through Bayesian probability updates. Players work through patient cases by asking history questions, performing physical exams, and ordering tests to narrow down the differential diagnosis.

## Features

- **Bayesian probability engine**: Each finding updates all diagnosis probabilities using likelihood ratios
- **Time-based cost system**: History is quick (1 min), exams are moderate (1-10 min), tests are slow (10-60 min) -- encouraging efficient clinical reasoning
- **Real clinical data**: Likelihood ratios derived from published medical literature (JAMA Rational Clinical Examination, Ottawa SAH Rule, POUND mnemonic)
- **Critical diagnosis alerts**: Life-threatening conditions are flagged so they aren't missed
- **Educational feedback**: Clinical pearls and key teaching points after each case
- **Multiple cases**: Dizziness and acute headache cases with more to come

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The project is configured for GitHub Pages deployment via GitHub Actions. Every push to `main` triggers an automatic build and deploy.

Live at: `https://felixholm.github.io/diagnostic-game/`

## Project Structure

```
src/
├── components/
│   ├── TitleScreen.jsx        # Title screen with instructions and case selection
│   ├── DiagnosticGame.jsx     # Main game controller
│   ├── ChatHistory.jsx        # Left panel: question/answer history
│   ├── ActionPanel.jsx        # Left panel: action selection tabs
│   ├── DiagnosisPanel.jsx     # Right panel: probability bars
│   ├── ActionTooltip.jsx      # Tooltip for potential findings
│   └── DiagnosisTooltip.jsx   # Tooltip for diagnosis evidence summary
├── data/
│   └── cases/
│       ├── dizziness_001.json
│       └── headache_001.json
├── utils/
│   └── lrHelpers.js           # Likelihood ratio display helpers
├── App.jsx                    # Screen manager (title / game)
├── main.jsx
└── index.css
```

## How the Game Works

### Bayesian Updates

Each action (question, exam, test) has likelihood ratios (LRs) for each diagnosis:
- LR > 1: Finding makes diagnosis more likely
- LR < 1: Finding makes diagnosis less likely
- LR = 1: Finding doesn't change probability

The probability update follows Bayes' theorem:
```
posterior_odds = prior_odds × likelihood_ratio
```

Probabilities are then normalized to sum to 1.

### Strategy

1. **Start with history questions** (1 min each) -- these often provide strong signal
2. **Use physical exam strategically** -- fast and often diagnostic
3. **Order expensive tests only when needed** -- imaging and labs are slow
4. **Watch for critical diagnoses** -- life-threatening conditions must not be missed
5. **Aim for high confidence** before committing to a final diagnosis

## Clinical Cases

### Dizziness (dizziness_001)
- **Patient**: 58-year-old female with acute dizziness
- **Differential**: BPPV, Vestibular Neuritis, Vestibular Migraine, Meniere's Disease, Orthostatic Hypotension, Posterior Stroke
- **Teaching points**: TiTrATE approach, HINTS exam, red flags for central causes

### Acute Headache (headache_001)
- **Patient**: 52-year-old male with sudden severe headache during exercise
- **Differential**: Migraine, Tension-Type Headache, Subarachnoid Hemorrhage, Bacterial Meningitis, Hypertensive Emergency, Temporal Arteritis (GCA)
- **Teaching points**: Ottawa SAH Rule, CT-LP pathway, thunderclap headache workup, meningeal signs

## Adding New Cases

Create a new JSON file in `src/data/cases/` and add it to the `CASES` array in `App.jsx`:

```json
{
  "case_id": "unique_id",
  "title": "Case Title",
  "patient_presentation": {
    "age": 58,
    "sex": "female",
    "chief_complaint": "...",
    "initial_description": "..."
  },
  "true_diagnosis": "diagnosis_id",
  "diagnoses": [
    {
      "id": "diagnosis_id",
      "name": "Display Name",
      "prior_probability": 0.25,
      "color": "#hex",
      "critical": { "label": "Cannot Miss", "reason": "Why this is critical" }
    }
  ],
  "actions": [
    {
      "id": "action_id",
      "type": "history|exam|test",
      "question": "What you ask/do",
      "description": "Clinical rationale",
      "cost": 1,
      "answer": "What you find",
      "lr": { "diagnosis_id": 2.5 },
      "potential_findings": [
        {
          "finding": "Finding name",
          "description": "What it means",
          "lr": { "diagnosis_id": 2.5 }
        }
      ]
    }
  ],
  "educational_feedback": {
    "diagnosis_id": {
      "explanation": "...",
      "key_findings": ["..."],
      "clinical_pearl": "..."
    }
  }
}
```

### Finding Likelihood Ratios

Good sources for evidence-based LRs:
- **JAMA Rational Clinical Examination series**
- **McGee's Evidence-Based Physical Diagnosis**
- **UpToDate** (sensitivity/specificity -- convert to LRs)
- **PubMed** systematic reviews

To convert sensitivity/specificity to LRs:
```
LR+ = sensitivity / (1 - specificity)
LR- = (1 - sensitivity) / specificity
```

## Tech Stack

- React 18
- Vite 7
- Tailwind CSS 3.4

## License

MIT -- Feel free to use for educational purposes.

## Credits

Likelihood ratios derived from:
- Kattah JC et al. Stroke 2009 (HINTS exam)
- Halker RB et al. Neurologist 2008 (Dix-Hallpike)
- Detsky ME et al. JAMA 2006 (migraine POUND mnemonic)
- Attia J et al. JAMA 1999 (meningitis clinical findings)
- van der Geest et al. JAMA Internal Medicine 2020 (GCA)
- Perry JJ et al. BMJ 2011 (Ottawa SAH Rule)
