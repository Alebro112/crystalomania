import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;

  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  value,
  ...props
}) => {
  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 
    ${value
      ? "text-gray-800 dark:text-white/90"
      : "text-gray-400 dark:text-gray-400"
    } ${className}`;

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800`;
  }


  return (
    <div>
      <select
        className={inputClasses}
        {...props}
      >
        {/* Placeholder option */}
        <option
          value=""

          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      {
        hint && (
          <p
            className={`mt-1.5 text-xs ${error
              ? "text-error-500"
              : success
                ? "text-success-500"
                : "text-gray-500"
              }`}
          >
            {hint}
          </p>
        )
      }
    </div>
  );
};

export default Select;
