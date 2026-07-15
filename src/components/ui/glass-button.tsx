import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

function cn(...inputs: Array<string | undefined | null | false>) {
  return inputs.filter(Boolean).join(" ")
}

const glassButtonVariants = cva(
  "glass-button relative isolate appearance-none cursor-pointer border-0 bg-transparent p-0 font-pairup-sans tracking-normal text-inherit disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default: "min-h-[52px] text-sm font-bold",
        sm: "min-h-10 text-xs font-bold",
        lg: "min-h-14 text-sm font-bold",
        icon: "size-[52px]",
      },
      tone: {
        light: "glass-button-tone-light",
        dark: "glass-button-tone-dark",
        coral: "glass-button-tone-coral",
      },
    },
    defaultVariants: {
      size: "default",
      tone: "light",
    },
  },
)

const glassButtonTextVariants = cva(
  "glass-button-text relative z-10 flex select-none items-center justify-center gap-2.5 whitespace-nowrap leading-none tracking-normal",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-7 py-4",
        icon: "size-[52px] p-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, tone, contentClassName, disabled, ...props }, ref) => (
    <div
      className={cn(
        "glass-button-wrap relative isolate inline-flex rounded-pairup",
        className,
      )}
      data-disabled={disabled ? "true" : undefined}
    >
      <button
        className={cn(glassButtonVariants({ size, tone }))}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
          {children}
        </span>
      </button>
      <span
        className="glass-button-shadow pointer-events-none absolute inset-x-1 top-1 -bottom-1 -z-10 rounded-pairup"
        aria-hidden="true"
      />
    </div>
  ),
)

GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
