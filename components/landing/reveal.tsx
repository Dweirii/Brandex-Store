/** Lightweight fade + rise entrance (no client-side runtime). */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const classes = className ? `packaging-reveal ${className}` : "packaging-reveal"
  return (
    <div className={classes} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
}
