'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: Set<string>;
  onStepClick?: (stepIndex: number, step: Step) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Stepper({
  steps,
  currentStep,
  completedSteps = new Set(),
  onStepClick,
  className,
  orientation = 'horizontal',
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'items-center justify-between' : 'flex-col space-y-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.id);
        const isActive = index === currentStep;
        const isClickable =
          onStepClick && (isCompleted || index <= currentStep);

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex items-center',
                isHorizontal ? 'flex-col' : 'flex-row',
                'space-y-2 space-x-0',
                isHorizontal ? '' : 'space-y-0 space-x-3',
                'transition-all duration-200'
              )}
            >
              <button
                onClick={() => isClickable && onStepClick?.(index, step)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50',
                  isActive &&
                    'border-primary bg-primary text-primary-foreground shadow-lg scale-110',
                  isCompleted &&
                    !isActive &&
                    'border-green-500 bg-green-500 text-white hover:bg-green-600',
                  !isActive &&
                    !isCompleted &&
                    'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50',
                  isClickable && !isActive && 'cursor-pointer hover:scale-105',
                  !isClickable && 'cursor-not-allowed opacity-50'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : step.icon ? (
                  <step.icon className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </button>

              <div
                className={cn(
                  'text-center',
                  isHorizontal ? 'max-w-[120px]' : 'flex-1',
                  !isHorizontal && 'text-left'
                )}
              >
                <div
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive && 'text-primary',
                    isCompleted && !isActive && 'text-green-600',
                    !isActive && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div
                    className={cn(
                      'text-xs mt-1 transition-colors',
                      isActive && 'text-primary/70',
                      isCompleted && !isActive && 'text-green-600/70',
                      !isActive && !isCompleted && 'text-muted-foreground/70'
                    )}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'transition-colors duration-200',
                  isHorizontal
                    ? 'flex-1 h-px bg-muted-foreground/20 mx-4'
                    : 'w-px h-8 bg-muted-foreground/20 ml-5',
                  (isCompleted || index < currentStep) && 'bg-primary/40'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Progress variant of the stepper
export interface StepperProgressProps
  extends Omit<StepperProps, 'orientation'> {
  showProgress?: boolean;
}

export function StepperProgress({
  steps,
  currentStep,
  completedSteps = new Set(),
  onStepClick,
  className,
  showProgress = true,
}: StepperProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Stepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={onStepClick}
        orientation="horizontal"
      />
    </div>
  );
}
