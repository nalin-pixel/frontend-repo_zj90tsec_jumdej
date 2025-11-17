import { useState } from 'react'

const feelingsList = ['Angry','Sad','Worried','Frustrated','Embarrassed','Shocked','Okay']

export default function ReportForm({ onSubmitted }) {
  const [form, setForm] = useState({
    student_id: '',
    title: '',
    description: '',
    feelings: [],
    triggers: '',
    actions_taken: '',
    support_requested: ''
  })
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL

  const toggleFeeling = (f) => {
    setForm((prev) => {
      const exists = prev.feelings.includes(f)
      return { ...prev, feelings: exists ? prev.feelings.filter(x => x !== f) : [...prev.feelings, f] }
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: form.student_id || undefined,
          title: form.title,
          description: form.description,
          feelings: form.feelings,
          triggers: form.triggers ? form.triggers.split(',').map(s => s.trim()).filter(Boolean) : [],
          actions_taken: form.actions_taken ? form.actions_taken.split(',').map(s => s.trim()).filter(Boolean) : [],
          support_requested: form.support_requested || undefined
        })
      })
      if (!res.ok) throw new Error('Failed to submit')
      onSubmitted && onSubmitted()
      setForm({ student_id:'', title:'', description:'', feelings:[], triggers:'', actions_taken:'', support_requested:'' })
    } catch (err) {
      alert('Could not submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-600">Student ID (optional)</label>
        <input value={form.student_id} onChange={e=>setForm({...form, student_id:e.target.value})} className="mt-1 w-full rounded border px-3 py-2" placeholder="e.g. email or school id" />
      </div>
      <div>
        <label className="block text-sm text-slate-600">Title</label>
        <input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="mt-1 w-full rounded border px-3 py-2" placeholder="Short title" />
      </div>
      <div>
        <label className="block text-sm text-slate-600">What happened?</label>
        <textarea required value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="mt-1 w-full rounded border px-3 py-2" rows={4} placeholder="Describe the incident" />
      </div>
      <div>
        <p className="block text-sm text-slate-600 mb-2">Feelings</p>
        <div className="flex flex-wrap gap-2">
          {feelingsList.map(f => (
            <button type="button" key={f} onClick={()=>toggleFeeling(f)} className={`px-3 py-1 rounded-full border ${form.feelings.includes(f) ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-sky-700 border-sky-300'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600">Triggers (comma separated)</label>
          <input value={form.triggers} onChange={e=>setForm({...form, triggers:e.target.value})} className="mt-1 w-full rounded border px-3 py-2" placeholder="Noise, argument, test..." />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Actions Taken (comma separated)</label>
          <input value={form.actions_taken} onChange={e=>setForm({...form, actions_taken:e.target.value})} className="mt-1 w-full rounded border px-3 py-2" placeholder="Walked away, asked for help..." />
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-600">Support Requested (optional)</label>
        <input value={form.support_requested} onChange={e=>setForm({...form, support_requested:e.target.value})} className="mt-1 w-full rounded border px-3 py-2" placeholder="What help do you need?" />
      </div>
      <button disabled={loading} className="w-full py-2 rounded bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Report'}</button>
    </form>
  )
}
