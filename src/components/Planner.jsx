import { useEffect, useState } from 'react'

export default function Planner() {
  const [goal, setGoal] = useState('')
  const [strategy, setStrategy] = useState('')
  const [strategies, setStrategies] = useState([])
  const [steps, setSteps] = useState([])
  const [studentId, setStudentId] = useState('')
  const [saving, setSaving] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL

  const addStrategy = () => {
    if (!strategy.trim()) return
    setStrategies([...strategies, strategy.trim()])
    setStrategy('')
  }

  const addStep = () => {
    const label = prompt('Add a step')
    if (label) setSteps([...steps, { label, done: false }])
  }

  const toggleStep = (i) => {
    setSteps(s => s.map((st, idx) => idx === i ? { ...st, done: !st.done } : st))
  }

  const savePlan = async () => {
    if (!goal.trim()) { alert('Please add a goal'); return }
    setSaving(true)
    try {
      const res = await fetch(`${backend}/api/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId || undefined,
          goal,
          strategies,
          steps,
          check_in_frequency: 'daily'
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      alert('Plan saved')
      setGoal(''); setStrategies([]); setSteps([])
    } catch (e) {
      alert('Could not save plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600">Student ID (optional)</label>
          <input value={studentId} onChange={e=>setStudentId(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" placeholder="e.g. email or school id" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Goal</label>
          <input value={goal} onChange={e=>setGoal(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" placeholder="e.g. Stay calm when frustrated" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-600">Strategies</label>
        <div className="flex gap-2 mt-1">
          <input value={strategy} onChange={e=>setStrategy(e.target.value)} className="flex-1 rounded border px-3 py-2" placeholder="e.g. Ask for a break, count to 10" />
          <button type="button" onClick={addStrategy} className="px-3 py-2 rounded bg-sky-600 text-white">Add</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {strategies.map((s,i)=> (
            <span key={i} className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300">{s}</span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm text-slate-600">Steps</label>
          <button type="button" onClick={addStep} className="px-3 py-1 rounded bg-slate-100 border">+ Add Step</button>
        </div>
        <ul className="mt-2 space-y-2">
          {steps.map((st, i) => (
            <li key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
              <input type="checkbox" checked={st.done} onChange={()=>toggleStep(i)} />
              <span className={st.done ? 'line-through text-slate-400' : ''}>{st.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <button disabled={saving} onClick={savePlan} className="w-full py-2 rounded bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60">{saving ? 'Saving...' : 'Save Plan'}</button>
    </div>
  )
}
