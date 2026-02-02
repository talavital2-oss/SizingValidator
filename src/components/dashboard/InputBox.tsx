interface InputBoxProps {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  disabled?: boolean
  min?: number
  max?: number
}

export function InputBox({
  label,
  value,
  onChange,
  step,
  disabled = false,
  min,
  max,
}: InputBoxProps) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </div>
      <input
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 disabled:opacity-50 disabled:bg-slate-800"
        type="number"
        step={step}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    </div>
  )
}
