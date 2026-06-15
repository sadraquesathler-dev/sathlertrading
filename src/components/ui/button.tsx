import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "gradient-button text-white hover:scale-[1.02] hover:brightness-125 hover:shadow-[0_0_48px_rgba(0,231,255,.34),0_0_70px_rgba(168,85,255,.26)]",
        secondary: "border border-accent/35 bg-white/[.08] text-secondary-foreground shadow-[0_0_24px_rgba(0,231,255,.08)] backdrop-blur-xl hover:border-accent/70 hover:bg-white/[.14] hover:text-white",
        ghost: "text-muted-foreground hover:bg-white/[.1] hover:text-accent hover:shadow-[0_0_22px_rgba(168,85,255,.16)]",
        outline: "border border-primary/45 bg-white/[.06] text-foreground shadow-[0_0_24px_rgba(168,85,255,.1)] backdrop-blur-xl hover:border-accent/70 hover:bg-white/[.12] hover:text-white",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_0_22px_rgba(255,79,120,.22)] hover:bg-destructive/90",
      },
      size: { default: "h-10 px-4 py-2", sm: "h-9 px-3", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
