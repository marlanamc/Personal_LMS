import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-[colors,box-shadow,transform,opacity] duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2';

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white shadow-sm hover:shadow-md hover:brightness-90',
      secondary: 'bg-secondary text-white shadow-sm hover:shadow-md hover:brightness-90',
      success: 'bg-success text-white hover:brightness-90 shadow-sm hover:shadow-md',
      warning: 'bg-warning text-white hover:brightness-90 shadow-sm hover:shadow-md',
      outline: 'bg-transparent border-2 border-border text-text hover:brightness-90',
      ghost: 'bg-transparent text-text hover:brightness-90 hover:bg-bg-light',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-2 text-sm min-h-[40px] rounded-md',
      md: 'px-5 py-3 text-base min-h-[48px] rounded-md',
      lg: 'px-6 py-4 text-lg min-h-[56px] rounded-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
