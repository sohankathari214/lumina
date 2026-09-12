'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  FlaskConical,
  Gauge,
  Info,
  Menu,
  MessageSquareText,
  Play,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'

const scenarios = [
  { label: 'Run now', detail: 'Moderate · 40 min', tone: 'coral', values: [148, 140, 118, 96, 88, 94] },
  { label: 'Wait 60 min', detail: 'Then run · 40 min', tone: 'teal', values: [148, 145, 137, 124, 112, 108] },
  { label: 'No exercise', detail: 'Rest of morning', tone: 'blue', values: [148, 153, 161, 157, 151, 146] },
]

function MiniChart({ values, tone, large = false }: { values: number[]; tone: string; large?: boolean }) {
  const width = large ? 650 : 300
  const height = large ? 215 : 116
  const min = 70
  const max = 180
  const points = values.map((value, index) => `${(index / (values.length - 1)) * width},${height - ((value - min) / (max - min)) * height}`).join(' ')
  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Predicted glucose trajectory chart" preserveAspectRatio="none">
      <line x1="0" y1={height - ((140 - min) / (max - min)) * height} x2={width} y2={height - ((140 - min) / (max - min)) * height} className="chart-target" />
      <line x1="0" y1={height - ((70 - min) / (max - min)) * height} x2={width} y2={height - ((70 - min) / (max - min)) * height} className="chart-low" />
      <polyline points={points} className={`chart-line ${tone}`} />
      {values.map((value, index) => <circle key={index} cx={(index / (values.length - 1)) * width} cy={height - ((value - min) / (max - min)) * height} r={large ? 3.5 : 2.5} className={`chart-dot ${tone}`} />)}
    </svg>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [question, setQuestion] = useState('')

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Activity size={18} strokeWidth={2.5} /></div><span>GlucoPilot</span><span className="prototype-badge">Research prototype</span></div>
        <nav className="nav-tabs" aria-label="Primary navigation">
          {['Overview', 'Scenarios', 'History'].map((tab) => <button key={tab} className={activeTab === tab ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>
        <div className="top-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><button className="profile-button"><span className="avatar">M</span><span className="profile-name">Maya</span><ChevronDown size={15} /></button><button className="mobile-menu icon-button" onClick={() => setDrawerOpen(true)} aria-label="Open menu"><Menu size={20} /></button></div>
      </header>

      {drawerOpen && <div className="mobile-drawer"><div className="drawer-head"><strong>GlucoPilot</strong><button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Close menu"><X size={20} /></button></div>{['Overview', 'Scenarios', 'History'].map((tab) => <button key={tab} onClick={() => { setActiveTab(tab); setDrawerOpen(false) }} className="drawer-link">{tab}</button>)}</div>}

      <section className="page-wrap">
        <div className="welcome-row"><div><p className="eyebrow">TUESDAY, MAY 14 · 10:42 AM</p><h1>Good morning, Maya.</h1><p className="muted">Here&apos;s your current context and what your model estimates may happen next.</p></div><button className="outline-button" onClick={() => setDrawerOpen(true)}><SlidersHorizontal size={16} /> Configure context</button></div>

        <div className="safety-note"><ShieldCheck size={18} /><div><strong>Decision support, not medical advice.</strong><span>GlucoPilot does not recommend insulin doses or determine whether an activity is medically safe.</span></div><Info size={16} className="note-info" /></div>

        <div className="grid-layout">
          <section className="content-column">
            <div className="section-heading"><div><p className="eyebrow">CURRENT STATE</p><h2>What&apos;s happening now</h2></div><button className="text-button">Edit context <ChevronDown size={14} /></button></div>
            <div className="state-grid">
              <article className="state-card glucose-card"><div className="card-label"><Gauge size={16} /> Current glucose</div><div className="glucose-value">145 <span>mg/dL</span></div><div className="trend"><ArrowDownRight size={17} /> Falling slowly</div><div className="sparkline"><MiniChart values={[162, 158, 154, 150, 148, 145]} tone="teal" /></div><p className="card-foot">Last reading 6 min ago</p></article>
              <article className="state-card"><div className="card-label"><Clock3 size={16} /> Recent inputs</div><div className="input-list"><div><span>Insulin</span><strong>3.0 units <small>· 60 min ago</small></strong></div><div><span>Carbohydrates</span><strong>50 g <small>· 60 min ago</small></strong></div><div><span>Sleep</span><strong>5.0 hours <small>last night</small></strong></div></div><button className="add-button"><Plus size={15} /> Add input</button></article>
            </div>

            <div className="section-heading scenario-heading"><div><p className="eyebrow">SCENARIO SIMULATOR</p><h2>What might happen?</h2></div><span className="model-status"><span className="status-dot" /> Model ready</span></div>
            <div className="simulator-card"><div className="simulator-top"><div className="action-icon"><Activity size={21} /></div><div><h3>Moderate run</h3><p>Cardio · 40 minutes · Starting now</p></div><button className="edit-pill">Edit</button></div><div className="scenario-options">{scenarios.map((scenario, index) => <div className={`scenario-option ${index === 0 ? 'selected' : ''}`} key={scenario.label}><div className={`radio ${index === 0 ? 'checked' : ''}`} /><div className="scenario-copy"><strong>{scenario.label}</strong><span>{scenario.detail}</span></div><div className="scenario-mini"><MiniChart values={scenario.values} tone={scenario.tone} /></div><strong className="scenario-end">{scenario.values[scenario.values.length - 1]} <small>mg/dL</small></strong></div>)}</div><div className="simulator-footer"><span><Sparkles size={15} /> Based on 14 similar episodes in your history</span><button className="run-button" onClick={() => setRunning(!running)}>{running ? 'Scenario running' : 'Run simulation'} <Play size={14} fill="currentColor" /></button></div></div>

            <div className="section-heading explain-heading"><div><p className="eyebrow">MODEL EXPLANATION</p><h2>Why this estimate?</h2></div><button className="text-button">View details <ChevronDown size={14} /></button></div>
            <div className="explanation-card"><div className="explanation-item"><div className="explanation-icon coral"><ArrowDownRight size={17} /></div><div><strong>Exercise may lower your glucose</strong><p>Your recent runs have lowered glucose by an average of 38 mg/dL over 90 minutes.</p></div></div><div className="explanation-item"><div className="explanation-icon blue"><FlaskConical size={17} /></div><div><strong>Active insulin is still present</strong><p>About 2.1 units may still be active from your recent bolus, based on your personal profile.</p></div></div><div className="explanation-item"><div className="explanation-icon amber"><AlertTriangle size={17} /></div><div><strong>Your sleep may add uncertainty</strong><p>Short sleep has been associated with a wider range of responses in your past episodes.</p></div></div></div>
          </section>

          <aside className="side-column"><div className="section-heading"><div><p className="eyebrow">PREDICTED TRAJECTORY</p><h2>Next 2 hours</h2></div><button className="icon-button"><CircleHelp size={17} /></button></div><div className="trajectory-card"><div className="trajectory-legend"><span><i className="legend-line coral-line" /> Run now</span><span><i className="legend-line teal-line" /> Wait 60 min</span><span><i className="legend-line blue-line" /> No exercise</span></div><div className="large-chart"><MiniChart values={scenarios[0].values} tone="coral" large /><div className="chart-labels"><span>Now</span><span>30m</span><span>60m</span><span>90m</span><span>120m</span></div></div><div className="trajectory-callout"><strong>Run now shows the lowest predicted trajectory.</strong><span>The model estimates a possible low around 88 mg/dL at 90 minutes.</span></div><div className="range-note"><Info size={15} /> Shaded uncertainty ranges are not shown in this prototype.</div></div><div className="history-card"><div className="history-head"><div><p className="eyebrow">PERSONALIZATION</p><h2>Your model learns</h2></div><span className="history-score">72%</span></div><p>Predictions use your past episodes alongside population data. More complete observations improve personalization.</p><div className="progress-track"><div /></div><div className="history-meta"><span>14 usable episodes</span><span>Good foundation</span></div><button className="secondary-button"><FileText size={15} /> Review history</button></div></aside>
        </div>
        <div className="question-bar"><MessageSquareText size={18} /><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about this scenario in your own words…" aria-label="Ask about this scenario" /><button onClick={() => setQuestion('')}>Ask GlucoPilot <ArrowDownRight size={15} /></button></div>
        <footer><span>GlucoPilot · Research and engineering prototype</span><span><ShieldCheck size={14} /> Your data stays private in this demo</span></footer>
      </section>
    </main>
  )
}
