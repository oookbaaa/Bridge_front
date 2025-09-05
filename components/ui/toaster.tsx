'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

// Bridge-themed icons for different toast types
const getToastIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-emerald-600" />;
    case 'destructive':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    default:
      return <Info className="h-5 w-5 text-primary" />;
  }
};

// Bridge card icon for all toasts with variant-based styling
const getBridgeIcon = (variant: string) => {
  const getIconStyle = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'w-6 h-6 object-contain filter brightness-110 saturate-150'; // Brighter for success
      case 'destructive':
        return 'w-6 h-6 object-contain filter brightness-90 saturate-150 hue-rotate-15'; // Slightly red tint
      case 'warning':
        return 'w-6 h-6 object-contain filter brightness-110 saturate-150 hue-rotate-45'; // Orange tint
      default:
        return 'w-6 h-6 object-contain'; // Default styling
    }
  };

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <img
        src="/icons8-cards-50.png"
        alt="Bridge Cards"
        className={getIconStyle(variant)}
      />
    </div>
  );
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-3">
              {/* Bridge-themed icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getBridgeIcon(variant || 'default')}
              </div>

              <div className="grid gap-1 flex-1">
                {title && (
                  <ToastTitle className="font-heading font-semibold text-base">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="font-body text-sm opacity-90">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
