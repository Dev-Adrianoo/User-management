import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string | React.ReactNode;
  icon?: string | React.ReactNode;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            {label}
            {required && <span className="text-orange-700 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors',
              error ? 'border-red-500' : 'border-gray-300',
              icon && 'pl-10',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
        
        {error && (
          <span className="text-xs text-red-500 mt-1 block">{error}</span>
        )}
        
        {!error && helperText && (
          <span className="text-xs text-gray-600 mt-1 block">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';