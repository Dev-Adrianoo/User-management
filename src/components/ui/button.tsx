import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300',
    secondary: 'text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-gray-300',
    outline: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-300',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (loadingText || children) : children}
    </button>
  );
}