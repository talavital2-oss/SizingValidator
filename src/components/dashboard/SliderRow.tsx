interface SliderRowProps {
  label: string
  valueLabel: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function SliderRow({
  label,
  valueLabel,
  value,
  min,
  max,
  step,
  onChange,
  disabled = false,
}: SliderRowProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="font-medium text-slate-300">{label}</div>
        <div className="text-cyan-400 font-semibold">{valueLabel}</div>
      </div>
      <input
        className="mt-2 w-full accent-cyan-500 disabled:opacity-50"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    </div>
  )
}
