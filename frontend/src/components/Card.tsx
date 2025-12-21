import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

const Card = ({ title, subtitle, action, children }: CardProps) => (
  <div className="glass card">
    <div className="card-header">
      <div>
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="card-body">{children}</div>
  </div>
)

export default Card
