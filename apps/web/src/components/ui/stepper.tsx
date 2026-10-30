import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={index} className="flex gap-4">
            {/* Connector line and circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  isCompleted && "border-accent-500 bg-accent-500 text-white dark:border-accent-400 dark:bg-accent-400 dark:text-cyber-950",
                  isCurrent && "border-accent-500 text-accent-500 dark:border-accent-400 dark:text-accent-400",
                  !isCompleted && !isCurrent && "border-cyber-300 text-cyber-400 dark:border-cyber-700 dark:text-cyber-600"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-8",
                    isCompleted ? "bg-accent-500 dark:bg-accent-400" : "bg-cyber-200 dark:bg-cyber-800"
                  )}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-8">
              <p
                className={cn(
                  "mt-2 font-semibold",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
