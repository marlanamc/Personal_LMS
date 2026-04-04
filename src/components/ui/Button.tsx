import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    // Base styles with glow transition and dark theme support
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-[colors,box-shadow,transform,filter] duration-300 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 relative overflow-hidden';

    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Pastel Rose/Pink with glow
      primary: 'bg-gradient-to-r from-primary to-primary-light text-white shadow-glow-pink hover:shadow-glow-pink-lg motion-safe:hover:scale-105 motion-safe:active:scale-95',

      // Secondary: Pastel Mint with glow
      secondary: 'bg-gradient-to-r from-secondary to-secondary-light text-white shadow-glow-mint hover:shadow-glow-mint-lg motion-safe:hover:scale-105 motion-safe:active:scale-95',

      // Accent: Pastel Lavender with glow
      accent: 'bg-gradient-to-r from-accent to-accent-light text-white shadow-glow-lavender hover:shadow-glow-lavender-lg motion-safe:hover:scale-105 motion-safe:active:scale-95',

      // Success: Pastel Aqua with glow
      success: 'bg-gradient-to-r from-success to-success text-white motion-safe:hover:scale-105 motion-safe:active:scale-95' + ' shadow-[0_0_20px_rgba(149,225,211,0.5)] hover:shadow-[0_0_30px_rgba(149,225,211,0.7)]',

      // Warning: Pastel Peach with glow
      warning: 'bg-gradient-to-r from-warning to-warning text-white motion-safe:hover:scale-105 motion-safe:active:scale-95' + ' shadow-[0_0_20px_rgba(255,180,162,0.5)] hover:shadow-[0_0_30px_rgba(255,180,162,0.7)]',

      // Ghost: Transparent with border glow
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-glow-pink motion-safe:hover:scale-105 motion-safe:active:scale-95',

      // Ghost: Transparent background
      ghost: 'bg-transparent text-text hover:bg-white/10 motion-safe:hover:scale-105 motion-safe:active:scale-95',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-2 text-sm min-h-[40px] rounded-md',
      md: 'px-5 py-3 text-base min-h-[48px] rounded-lg',
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
