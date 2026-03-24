import { cn } from "@/lib/utils"
import React from "react";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Field, FieldLabel } from "../../ui/field";

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
};

export function HiveMimeMultiStep({
  className,
  children,
  canCancel,
  onStepFinished,
  onFinished,
  onCancelled,
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

  return (
    <div className={cn("flex flex-col gap-8", className)}
      {...props}
    >
        <div className="flex-1">
            {steps[currentStep]}
        </div>

        <div className="flex flex-row gap-8">
            <Button
                variant="outline"
                disabled={currentStep == 0 && !canCancel}
                onClick={() => advanceStep(-1)}
            >
                {currentStep === 0 ? "Cancel" : "Back"}
            </Button>
            <Field className="flex-1">
                <FieldLabel htmlFor="progress-upload">
                    <span>Step</span>
                    <span className="ml-auto">{currentStep + 1}/{totalSteps}</span>
                </FieldLabel>
                <Progress value={Math.round(((currentStep + 1) / totalSteps) * 100)} id="progress-upload" />
            </Field>
            <Button
                onClick={() => advanceStep(1)}
                disabled={!steps[currentStep]?.props.canContinue}
            >
                {currentStep === totalSteps - 1 ? "Finish" : "Next"}
            </Button>
        </div>
    </div>
  )
}

