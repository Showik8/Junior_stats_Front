import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 select-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 shadow-sm hover:shadow",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-sm hover:shadow",
    ghost:
      "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500 shadow-sm hover:shadow",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className} ${
        isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      }`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="shrink-0">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className="shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
