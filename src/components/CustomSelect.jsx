import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ 
  value, 
  onChange, 
  placeholder, 
  options, 
  required = false,
  openDirection = 'auto' // 'auto', 'up', 'down'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState('down');
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detecta se deve abrir para cima ou para baixo
  useLayoutEffect(() => {
    if (!isOpen || openDirection !== 'auto' || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 250; // max-h-60 aproximadamente

    setDropdownDirection(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'up' : 'down');
  }, [isOpen, openDirection]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const isSelected = value && selectedOption;
  
  const finalDirection = openDirection === 'auto' ? dropdownDirection : openDirection;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Botão principal */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none transition-all flex items-center justify-between ${
          isSelected ? 'text-black' : 'text-gray-400'
        }`}
        required={required}
      >
        <span>{displayText}</span>
        <ChevronDown 
          size={20} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className={`absolute left-0 right-0 bg-white border-2 border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden ${
            finalDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <div className="max-h-50 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                  value === option.value
                    ? 'bg-blue-50 text-black border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
