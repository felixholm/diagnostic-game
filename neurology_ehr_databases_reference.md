# Open-Access Neurology EHR & Clinical Databases

*Reference compiled January 2026*

---

## Overview

Finding open-access neurology-specific EHR databases with clinical notes is challenging. The **NeuroDiscovery AI database** (comprehensive real-world EHR data from U.S. neurology outpatient clinics) is not openly available. Below are the best alternatives.

---

## Clinical Text / NLP Databases

### 1. MIMIC-IV-Note (PhysioNet)
**Best option for clinical notes**

- **Content**: 331,794 deidentified discharge summaries + 2,321,355 radiology reports
- **Source**: Beth Israel Deaconess Medical Center (ICU patients)
- **Format**: Linkable to structured MIMIC-IV data
- **Access**: Credentialed access via PhysioNet (free, requires CITI training)
- **Neurology relevance**: Filter by ICD codes for stroke, seizures, dementia, movement disorders
- **URL**: https://physionet.org/content/mimic-iv-note/

**Limitations**: ICU-focused, not outpatient neurology; requires filtering for relevant cases

### 2. n2c2 / i2b2 Clinical NLP Datasets
**Good for NLP method development**

- **Content**: ~1,500+ fully deidentified clinical notes from Partners Healthcare
- **Tasks covered**: De-identification, NER, relation extraction, temporal information extraction, medication extraction, adverse drug events
- **Access**: Data Use Agreement via Harvard DBMI Data Portal
- **URL**: https://n2c2.dbmi.hms.harvard.edu/data-sets

**Limitations**: General clinical notes, not neurology-specific

---

## Disease-Specific Registries (Structured Data)

### 3. PPMI — Parkinson's Progression Markers Initiative
**Best for Parkinson's research**

- **Content**: Clinical, imaging, 'omics, genetic, sensor, and biomarker data
- **Participants**: 4,000+ (including prodromal, genetic PD, and controls)
- **Data types**: MDS-UPDRS scores, MoCA, DaTSCAN imaging, CSF biomarkers, genetic data, wearable sensor data
- **Access**: Free for qualified researchers (approval typically within 1 week)
- **Sponsor**: Michael J. Fox Foundation
- **URL**: https://www.ppmi-info.org/access-data-specimens/download-data

**Limitations**: Structured assessments, limited narrative clinical notes

### 4. PRO-ACT — ALS Clinical Trial Database
**For ALS/motor neuron disease**

- **Content**: 10,700+ de-identified clinical records from 23 Phase II/III trials
- **Data types**: Demographics, lab values, medical/family history, longitudinal data points (10+ million)
- **Access**: Open access
- **URL**: https://ncri1.partners.org/ProACT

### 5. ADNI — Alzheimer's Disease Neuroimaging Initiative
**For Alzheimer's/dementia research**

- **Content**: Clinical, imaging, genetic, and biomarker data
- **Focus**: Progression from normal aging → MCI → Alzheimer's
- **Access**: Application required
- **URL**: https://adni.loni.usc.edu/

---

## EEG / Electrophysiology Datasets

### Alzheimer's & Dementia
- **OpenNeuro ds004504**: Resting-state EEG from 36 AD, 23 FTD, 29 healthy controls (BIDS format, includes MMSE scores)
- **URL**: https://openneuro.org/datasets/ds004504

### Parkinson's Disease
- **Narayanan Lab datasets**: Multiple resting-state and task EEG datasets from PD patients
- **URL**: https://narayanan.lab.uiowa.edu/datasets

### Epilepsy
- **CHB-MIT**: 23 pediatric epilepsy patients, seizure annotations
- **URL**: https://physionet.org/content/chbmit/
- **Temple University Hospital EEG Corpus**: 12,000+ patients, 16-channel EEG

### Curated Lists
- **OpenLists/ElectrophysiologyData**: https://github.com/openlists/ElectrophysiologyData
- **EEG Dataset Collection**: https://github.com/hubandad/eeg-dataset

---

## Synthetic / Augmentation Approaches

### Asclepius-R
- **Purpose**: Clinical LLM trained on MIMIC-III discharge summaries
- **Use case**: Generate synthetic clinical notes for training/evaluation
- **Access**: PhysioNet (credentialed)
- **URL**: https://physionet.org/content/asclepius-r/

---

## Practical Recommendations

### For Patient Simulator / Diagnostic Reasoning Games:

1. **Primary source**: MIMIC-IV-Note filtered by neurology ICD codes
   - Stroke: I60-I69, 430-438
   - Epilepsy: G40-G41, 345
   - Parkinson's: G20, 332
   - Dementia: F00-F03, G30, 290, 331

2. **Supplement with**: PPMI structured data for realistic Parkinson's progression trajectories

3. **Consider**: Synthetic note generation using Asclepius or similar clinical LLMs to augment limited real data

### Access Requirements Summary:

| Database | Access Type | Time to Access |
|----------|-------------|----------------|
| MIMIC-IV-Note | Credentialed (CITI training) | 1-2 weeks |
| n2c2/i2b2 | DUA | ~1 week |
| PPMI | Application | ~1 week |
| PRO-ACT | Open | Immediate |
| OpenNeuro | Open | Immediate |

---

## Gap Analysis

**What NeuroDiscovery AI has that open databases lack:**
- Outpatient neurology clinic data (most open data is inpatient/ICU)
- Longitudinal real-world treatment and symptom trajectories
- Comprehensive coverage across neurological conditions
- ~355,000 patients with rich clinical narratives

**Potential solutions:**
- Collaborate with institutions that have neurology EHR access
- Use federated learning approaches
- Generate synthetic cases based on clinical guidelines + real distributions from PPMI/MIMIC

---

*Last updated: January 2026*
