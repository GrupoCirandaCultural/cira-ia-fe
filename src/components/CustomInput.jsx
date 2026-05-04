import React, { useState } from 'react';

export default function CustomInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  maxLength,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholder = !value && !isFocused;

  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        maxLength={maxLength}
        className={`w-full p-3 sm:p-4 sm:text-base bg-gray-50 border-2 border-gray-100 rounded-xl outline-none transition-all text-base ${className}`}
        {...props}
      />
      {/* Placeholder visual - renderiza se campo vazio e não focado */}
      {showPlaceholder && placeholder && (
        <span className="absolute top-3 sm:top-4 left-3 sm:left-4 text-gray-400 text-sm sm:text-base pointer-events-none">
          {placeholder}
        </span>
      )}
    </div>
  );
}
