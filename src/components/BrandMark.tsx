type BrandMarkProps = {
  className?: string
  title?: string
}

export function BrandMark({ className = "", title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 42 42"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M18.25 10.25H13.5a7.75 7.75 0 0 0 0 15.5h4.75"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M23.75 31.75h4.75a7.75 7.75 0 0 0 0-15.5h-4.75"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M15.5 21h11"
        stroke="#FF7568"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="21" cy="21" r="2.1" fill="#F7F7FB" />
    </svg>
  )
}
