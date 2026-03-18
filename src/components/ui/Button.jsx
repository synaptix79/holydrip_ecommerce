import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, ghost
  size = 'md', // sm, md, lg
  fullWidth = false,
  className = '',
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const stateClass = (loading || disabled) ? 'btn-disabled' : '';
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${stateClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-loader"></span>
      ) : children}
    </button>
  );
};
