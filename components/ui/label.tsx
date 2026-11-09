import { cn } from "cn"

function Label({ className, htmlFor, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" htmlFor={htmlFor} className={cn("block text-[0.9375rem] font-medium", className)} {...props} />
}

export { Label }
