import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: ReactNode
}

const Input = ({ label, hint, className = '', ...rest }: InputProps) => {
  return (
    <label className="input-wrapper">
      {label && <span className="input-label">{label}</span>}
      <input className={`input ${className}`} {...rest} />
      {hint && <span className="input-hint">{hint}</span>}
    </label>
  )
}

export default Input
