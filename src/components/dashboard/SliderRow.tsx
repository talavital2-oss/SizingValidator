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
    <div className="py-3">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <div className="font-medium">{label}</div>
        <div className="text-blue-700 font-medium">{valueLabel}</div>
      </div>
      <input
        className="mt-2 w-full accent-blue-600 disabled:opacity-50"
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
