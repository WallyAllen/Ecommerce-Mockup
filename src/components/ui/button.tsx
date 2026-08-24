import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-black uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 min-h-[48px] rounded-none",
          {
            "bg-[#E60000] text-white hover:bg-white hover:text-black border-2 border-[#E60000] hover:border-white": variant === "default",
            "border-2 border-[#333] bg-transparent hover:border-white hover:bg-white hover:text-black text-white": variant === "outline",
            "hover:bg-[#111] hover:text-white text-neutral-400": variant === "ghost",
            "text-white underline-offset-4 hover:underline": variant === "link",
            "h-12 px-8": size === "default",
            "h-10 px-4 text-xs": size === "sm",
            "h-14 px-10 text-base": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
