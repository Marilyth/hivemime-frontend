import { cn } from "@/lib/utils"
import React from "react";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Label } from "@/components/ui/label";

interface HiveMimeStepContextValue {
  next: () => void;
  back: () => void;
  currentStepIndex: number;
  totalSteps: number;
}

const HiveMimeStepContext = React.createContext<HiveMimeStepContextValue | null>(null);

export function useHiveMimeStep() {
  const context = React.useContext(HiveMimeStepContext);
  if (!context) {
    throw new Error('useHiveMimeStep must be used within a HiveMimeMultiStep component');
  }
  return context;
}

interface HiveMimeStepProps extends React.ComponentProps<"div"> {
  canContinue: boolean;
};

export function HiveMimeStep({
  canContinue,
  children,
  ...props
}: HiveMimeStepProps) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

type HiveMimeMultiStepProps = React.ComponentProps<"div"> & {
  onFinished?: () => void;
  onCancelled?: () => void;
  onStepFinished?: (stepIndex: number) => void;
  canCancel: boolean;
  showProgress?: boolean;
  stepLabel?: string;
};

export function HiveMimeMultiStep({
  className,
  children,
  canCancel,
  onStepFinished,
  onFinished,
  onCancelled,
  stepLabel = "Step",
  showProgress = true,
  ...props
}: HiveMimeMultiStepProps) {
  const steps = React.Children.toArray(children) as React.ReactElement<HiveMimeStepProps>[];
  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = React.useState(0);

  function advanceStep(increment: number = 1) {
    const newValue = currentStep + increment;

    if (increment > 0)
      onStepFinished?.(newValue);

    if (newValue < 0 && canCancel)
      onCancelled?.();
    else if (newValue >= totalSteps)
      onFinished?.();
    else
      setCurrentStep(newValue);
  }

  // Create context value with navigation functions
  const contextValue: HiveMimeStepContextValue = React.useMemo(() => ({
    next: () => advanceStep(1),
    back: () => advanceStep(-1),
    currentStepIndex: currentStep,
    totalSteps: totalSteps
  }), [currentStep, totalSteps]);

  return (
    <HiveMimeStepContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-8", className)}
        {...props}
      >
        <div className="flex-1">
          {steps[currentStep]}
        </div>

        <div className="flex flex-row items-center gap-2 justify-end">
          <Button
            variant="outline"
            disabled={currentStep == 0 && !canCancel}
            onClick={() => advanceStep(-1)}
          >
            {currentStep === 0 ? "Cancel" : "Back"}
          </Button>

          {showProgress && (
            <div className="flex flex-col flex-1 mx-2 gap-1">
              <Label>
                <span>{stepLabel}</span>
                <span className="ml-auto">{currentStep + 1}/{totalSteps}</span>
              </Label>
              <Progress value={Math.round(((currentStep + 1) / totalSteps) * 100)} className="black" />
            </div>
          )}

          <Button
            onClick={() => advanceStep(1)}
            disabled={!steps[currentStep]?.props.canContinue}
          >
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </HiveMimeStepContext.Provider>
  )
}

