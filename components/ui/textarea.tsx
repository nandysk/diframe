import { cn } from "cn"
import { fieldClass } from "@/components/ui/input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldClass, "block min-h-40 resize-y py-3 leading-[1.5]", className)} {...props} />
}

export { Textarea }
