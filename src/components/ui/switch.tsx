import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-primary/10 data-[state=unchecked]:border-primary/40 data-[state=unchecked]:shadow-[inset_0_1px_4px_rgba(59,130,246,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md ring-0 transition-all duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-[0_1px_3px_rgba(59,130,246,0.3)]",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
