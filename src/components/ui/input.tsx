import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn("flex h-10 w-full rounded-md border border-input/80 bg-white/[.06] px-3 py-2 text-sm text-foreground shadow-inner shadow-black/10 backdrop-blur placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
