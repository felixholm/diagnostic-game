# Diagnostic Reasoning Game

An educational game teaching clinical diagnostic reasoning through Bayesian probability updates. Players work through a patient case by asking history questions, performing physical exams, and ordering tests to narrow down the differential diagnosis.

## Features

- **Bayesian probability engine**: Each finding updates all diagnosis probabilities using likelihood ratios
- **Cost-aware gameplay**: History is free, exams are cheap, tests are expensive—encouraging efficient clinical reasoning
- **Real clinical data**: Likelihood ratios derived from published medical literature
- **Educational feedback**: Clinical pearls and key teaching points after each case

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── DiagnosticGame.jsx   # Main game controller
│   ├── ChatHistory.jsx      # Left panel: question/answer history
│   ├── ActionPanel.jsx      # Left panel: action selection tabs
│   └── DiagnosisPanel.jsx   # Right panel: probability bars & scoring
├── data/
│   └── cases/
│       └── dizziness_001.json  # Case data with LRs
├── App.jsx
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

### Scoring

- Correct diagnosis: +100 points
- Incorrect diagnosis: -50 points
- Total cost of tests/exams: subtracted from score
- **Goal**: Maximize score by reaching correct diagnosis with minimal testing

### Winning Strategy

1. **Start with free history questions** - these often provide strong signal
2. **Use physical exam strategically** - cheap and often diagnostic
3. **Order expensive tests only when needed** - MRI costs $100!
4. **Aim for ≥90% confidence** before diagnosing

## Adding New Cases

Create a new JSON file in `src/data/cases/` following this structure:

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
      "color": "#hex"
    }
  ],
  "actions": [
    {
      "id": "action_id",
      "type": "history|exam|test",
      "question": "What you ask/do",
      "cost": 0,
      "answer": "What you find",
      "lr": {
        "diagnosis_id": 2.5,
        "other_diagnosis": 0.5
      }
    }
  ]
}
```

### Finding Likelihood Ratios

Good sources for evidence-based LRs:
- **McGee's Evidence-Based Physical Diagnosis**
- **JAMA Rational Clinical Examination series**
- **UpToDate** (sensitivity/specificity → convert to LRs)
- **PubMed** systematic reviews

To convert sensitivity/specificity to LRs:
```
LR+ = sensitivity / (1 - specificity)
LR- = (1 - sensitivity) / specificity
```

## Future Enhancements

- [ ] Multiple cases with case selector
- [ ] Difficulty levels
- [ ] Timed mode
- [ ] Leaderboard
- [ ] Detailed explanations for each finding
- [ ] Sound effects for probability shifts
- [ ] Mobile-responsive design

## Clinical Cases Included

### Dizziness (dizziness_001)
**Differential:** BPPV, Vestibular Neuritis, Vestibular Migraine, Meniere's Disease, Orthostatic Hypotension, Posterior Stroke

**Teaching points:**
- TiTrATE approach (Timing, Triggers, Targeted Exam)
- HINTS exam for acute vestibular syndrome
- Red flags for central causes

## License

MIT - Feel free to use for educational purposes.

## Credits

Likelihood ratios derived from:
- Kattah JC et al. Stroke 2009 (HINTS exam)
- Halker RB et al. Neurologist 2008 (Dix-Hallpike)
- AAFP clinical reviews on dizziness
- Bárány Society diagnostic criteria
