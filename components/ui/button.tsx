import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  /** Pour pouvoir faire <Button asChild><Link/></Button> */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    // ✅ quand asChild=true on rend Slot, sinon un vrai <button>
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl bg-[#0055FF] px-4 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60",
          className
        )}
        {...props}  
      />
    )
  }
)
Button.displayName = "Button"
