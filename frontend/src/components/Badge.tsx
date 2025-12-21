type BadgeProps = {
  tone?: 'success' | 'warning' | 'info'
  label: string
}

const toneClass: Record<NonNullable<BadgeProps['tone']>, string> = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  info: 'badge badge-info',
}

const Badge = ({ tone = 'info', label }: BadgeProps) => {
  return <span className={toneClass[tone]}>{label}</span>
}

export default Badge
