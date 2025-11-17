import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Breathing from './components/Breathing'
import Planner from './components/Planner'
import ReportForm from './components/ReportForm'
import Games from './components/Games'

const brand = {
  name: 'Insight',
  primary: 'bg-blue-900',
  primaryText: 'text-blue-900',
  sky: 'bg-sky-500',
}

function Navbar() {
  const location = useLocation()
  const link = (to, label) => (
    <Link to={to} className={`px-3 py-2 rounded ${location.pathname === to ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'}`}>{label}</Link>
  )
  return (
    <div className="sticky top-0 z-10">
      <div className={`${brand.primary} text-white`}> 
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-bold text-lg">Insight</div>
          <div className="flex gap-1">
            {link('/', 'Home')}
            {link('/breathing', 'Breathing')}
            {link('/planner', 'Program')}
            {link('/report', 'Report')}
            {link('/games', 'Games')}
          </div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const backend = import.meta.env.VITE_BACKEND_URL
  const [status, setStatus] = useState('')
  useEffect(()=>{
    fetch(`${backend}/test`).then(r=>r.json()).then(d=> setStatus(d.backend + ' • DB: ' + d.database)).catch(()=>setStatus('Backend unavailable'))
  },[])
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h1 className="text-3xl font-bold text-blue-900">Welcome to Insight</h1>
        <p className="text-slate-600 mt-2">A calm place to report incidents, practice breathing, and build better habits.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card title="Breathing" desc="Guided breaths to settle your body" to="/breathing" />
          <Card title="Program" desc="Create a simple plan to improve behaviour" to="/planner" />
          <Card title="Report" desc="Write what happened and how you felt" to="/report" />
        </div>
        <div className="mt-6 text-sm text-slate-500">Status: {status}</div>
      </div>
    </div>
  )
}

function Card({ title, desc, to }) {
  return (
    <Link to={to} className="block p-4 border rounded-lg hover:shadow bg-gradient-to-br from-white to-sky-50">
      <div className="text-blue-900 font-semibold">{title}</div>
      <div className="text-slate-600 text-sm">{desc}</div>
    </Link>
  )
}

function BreathingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SectionTitle title="Breathing Exercise" subtitle="Follow the prompts to calm down" />
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <Breathing />
      </div>
    </div>
  )
}

function PlannerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionTitle title="Program Planner" subtitle="Set a goal, add strategies, and take small steps" />
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <Planner />
      </div>
    </div>
  )
}

function ReportPage() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionTitle title="Incident Report" subtitle="Explain what happened and how you feel" />
      <div className="bg-white rounded-xl border shadow-sm p-6">
        {submitted ? (
          <div className="text-center">
            <h3 className="text-blue-900 font-semibold text-lg">Thanks for sharing.</h3>
            <p className="text-slate-600">Your report has been recorded.</p>
            <div className="mt-4">
              <Link to="/" className="px-4 py-2 rounded bg-blue-900 text-white">Go Home</Link>
            </div>
          </div>
        ) : (
          <ReportForm onSubmitted={()=>setSubmitted(true)} />
        )}
      </div>
    </div>
  )
}

function GamesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionTitle title="Calming Games" subtitle="Light, interactive activities to refocus" />
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <Games />
      </div>
    </div>
  )
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
      <p className="text-slate-600">{subtitle}</p>
    </div>
  )
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/breathing" element={<BreathingPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/games" element={<GamesPage />} />
        </Routes>
        <footer className="mt-12 py-8 text-center text-slate-500">Made with care • Insight</footer>
      </div>
    </BrowserRouter>
  )
}
