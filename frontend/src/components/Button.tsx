import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  fullWidth?: boolean
  children: ReactNode
}

const Button = ({ variant = 'primary', fullWidth, className = '', children, ...rest }: ButtonProps) => {
  const classes = [
    'btn',
    variant === 'ghost' ? 'btn-ghost' : 'btn-primary',
    fullWidth ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
