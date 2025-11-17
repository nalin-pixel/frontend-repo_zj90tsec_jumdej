import { useState } from 'react'

function PopBubbles() {
  const [bubbles, setBubbles] = useState(Array.from({ length: 18 }, (_, i) => ({ id: i, popped: false })))
  const pop = (id) => setBubbles(b => b.map(x => x.id === id ? { ...x, popped: true } : x))
  const reset = () => setBubbles(Array.from({ length: 18 }, (_, i) => ({ id: i, popped: false })))
  return (
    <div>
      <div className="grid grid-cols-6 gap-3 mb-4">
        {bubbles.map(b => (
          <button key={b.id} onClick={() => pop(b.id)} className={`h-12 w-12 rounded-full transition-all ${b.popped ? 'bg-slate-200 scale-90' : 'bg-sky-300 hover:bg-sky-400'}`} />
        ))}
      </div>
      <button onClick={reset} className="px-3 py-2 rounded bg-slate-100 border">Reset</button>
    </div>
  )
}

function ColorMatch() {
  const colors = ['bg-sky-400','bg-blue-700','bg-blue-300','bg-sky-600','bg-blue-500']
  const [target, setTarget] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')
  const pick = (i) => {
    if (i === target) { setScore(s=>s+1); setMessage('Great!'); setTarget(Math.floor(Math.random()*colors.length)) }
    else { setMessage('Try again'); }
  }
  return (
    <div>
      <p className="mb-2">Click the color that matches the label: <span className="font-bold">{colors[target].replace('bg-','').replace('-',' ')}</span></p>
      <div className="flex gap-2 mb-2">
        {colors.map((c,i)=>(
          <button key={c} onClick={()=>pick(i)} className={`h-10 w-10 rounded ${c}`} />
        ))}
      </div>
      <p className="text-slate-600">Score: {score} {message && `- ${message}`}</p>
    </div>
  )
}

export default function Games() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded border bg-white">
        <h3 className="font-semibold text-sky-900 mb-2">Pop the Bubbles</h3>
        <PopBubbles />
      </div>
      <div className="p-4 rounded border bg-white">
        <h3 className="font-semibold text-sky-900 mb-2">Color Match</h3>
        <ColorMatch />
      </div>
    </div>
  )
}
