import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Componente Contenedor Principal
const Accordion = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("divide-y divide-zinc-800", className)} {...props}>
    {children}
  </div>
);

// Ítem individual de FAQ con animación fluida en CSS
const AccordionItem = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border-b border-zinc-800", className)} {...props}>
    {children}
  </div>
);
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm"
    {...props}
  >
    <div className={cn("pb-4 pt-0 text-zinc-400 leading-relaxed", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

// Estructura completa de Trigger + Content animado
interface AccordionSingleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItemCustom({ title, children, className }: AccordionSingleProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("border-b border-zinc-800", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors hover:text-emerald-400"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-300 ease-in-out",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Transición CSS nativa mediante CSS Grid */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0 pb-0"
        )}
      >
        <div className="overflow-hidden text-sm text-zinc-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// Compatibilidad con los componentes anteriores
const AccordionTrigger = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn("flex w-full items-center justify-between py-4 text-sm font-medium", className)} {...props}>
    {children}
  </button>
);

const AccordionContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pb-4 text-sm text-zinc-400", className)} {...props}>
    {children}
  </div>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };