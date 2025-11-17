import { useEffect, useState } from 'react'

const steps = [
  { label: 'Inhale', seconds: 4 },
  { label: 'Hold', seconds: 4 },
  { label: 'Exhale', seconds: 6 },
  { label: 'Hold', seconds: 2 },
]

export default function Breathing() {
  const [index, setIndex] = useState(0)
  const [counter, setCounter] = useState(steps[0].seconds)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    setCounter(steps[index].seconds)
    const interval = setInterval(() => {
      setCounter((c) => {
        if (c <= 1) {
          setIndex((i) => (i + 1) % steps.length)
          return steps[(index + 1) % steps.length].seconds
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [index, running])

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="relative mx-auto my-6 h-48 w-48 flex items-center justify-center">
        <div className={`transition-all duration-700 rounded-full bg-sky-200/60 border border-sky-400 shadow-inner`} style={{
          height: `${running ? 12 + (steps[index].seconds * 6)}rem`,
          width: `${running ? 12 + (steps[index].seconds * 6)}rem`,
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <p className="text-sky-900 text-2xl font-bold">{steps[index].label}</p>
            <p className="text-sky-700 text-lg">{counter}s</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setRunning(true)} className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700">Start</button>
        <button onClick={() => setRunning(false)} className="px-4 py-2 rounded bg-slate-200 text-slate-800 hover:bg-slate-300">Pause</button>
        <button onClick={() => { setRunning(false); setIndex(0); setCounter(steps[0].seconds) }} className="px-4 py-2 rounded bg-white border text-slate-700 hover:bg-slate-50">Reset</button>
      </div>
      <p className="mt-4 text-slate-600">Follow the prompts. Try 4-4-6-2 breathing to calm your body.</p>
    </div>
  )
}
