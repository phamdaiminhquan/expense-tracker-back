"use client";

import { ComponentProps } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/common/lib/utils.lib";

function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
        "text-base",
        "text-lg",
        "text-xs",
        "text-sm"
      )}
      {...props}
    />
  );
}

export { Label };
