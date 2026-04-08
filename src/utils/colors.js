// src/utils/colors.js
export const getEstandeColors = (idEstande) => {
  const colors = {
    estande_norte: {
      main: 'blue',
      light50: 'bg-blue-50',
      light100: 'bg-blue-100',
      text500: 'text-blue-500',
      text600: 'text-blue-600',
      bg500: 'bg-blue-500',
      bg600: 'bg-blue-600',
      border: 'border-blue-400',
      border100: 'border-blue-100',
      borderTop: 'border-t-blue-500',
      border500: 'border-l-blue-500',
      accent: 'accent-blue-500',
      focus: 'focus:border-blue-400',
      gradient: 'from-blue-500 to-cyan-500'
    },
    ciranda_bienal: {
      main: 'pink',
      light50: 'bg-pink-50',
      light100: 'bg-pink-100',
      text500: 'text-pink-500',
      text600: 'text-pink-600',
      bg500: 'bg-pink-500',
      bg600: 'bg-pink-600',
      border: 'border-pink-400',
      border100: 'border-pink-100',
      borderTop: 'border-t-pink-500',
      border500: 'border-l-pink-500',
      accent: 'accent-pink-500',
      focus: 'focus:border-pink-400',
      gradient: 'from-pink-500 to-rose-500'
    },
    estande_sul: {
      main: 'green',
      light50: 'bg-green-50',
      light100: 'bg-green-100',
      text500: 'text-green-500',
      text600: 'text-green-600',
      bg500: 'bg-green-500',
      bg600: 'bg-green-600',
      border: 'border-green-400',
      border100: 'border-green-100',
      borderTop: 'border-t-green-500',
      border500: 'border-l-green-500',
      accent: 'accent-green-500',
      focus: 'focus:border-green-400',
      gradient: 'from-green-500 to-emerald-500'
    }
  };
  return colors[idEstande] || colors.ciranda_bienal;
};
