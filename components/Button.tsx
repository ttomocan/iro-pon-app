import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = 'w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 active:scale-95';
  
  const variantStyles = {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-600/30 shadow-lg shadow-cyan-600/20',
    secondary: 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 focus:ring-slate-900/10'
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;