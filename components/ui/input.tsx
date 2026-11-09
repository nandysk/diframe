import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

const fieldClass =
  "w-full rounded-[14px] border border-[color:var(--field-line)] bg-[var(--field-bg)] px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-foreground aria-invalid:border-[color:var(--danger)] disabled:opacity-50"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <InputPrimitive data-slot="input" className={cn(fieldClass, "min-h-12 py-2", className)} {...props} />
}

export { Input, fieldClass }
