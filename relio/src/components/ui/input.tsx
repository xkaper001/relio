import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-5 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
          className
        )}
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
