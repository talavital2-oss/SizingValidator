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
      <div className="text-[11px] uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <input
        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:bg-slate-50"
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
