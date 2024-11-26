"use client"
import { h } from 'preact'; // Import h from Preact
import { forwardRef } from 'preact/compat'; // Import forwardRef from Preact compatibility layer
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { twMerge } from "tailwind-merge"
import { clsx} from "clsx"


function cn(...inputs) {
    return twMerge(clsx(inputs))
} 
 
export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef((props, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      props.className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = forwardRef((props, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      props.className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = forwardRef((props, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      props.className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

