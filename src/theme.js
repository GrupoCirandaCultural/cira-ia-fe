// Configurações de tema por estande
export const ESTANDE_THEMES = {
  estande_laranja: {
    id: 'N164',
    nome: 'Laranja',
    bgGradient: 'from-orange-400 to-orange-500',
    primaryColor: '#F9B334',
    primaryColorHex: '#F9B334',
    accentColor: '#FFB366',
    darkColor: '#E67E22',
    buttonPrimary: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
    buttonSecondary: 'bg-white text-orange-600 border-2 border-orange-500',
    textPrimary: 'text-orange-600',
    textLight: 'text-orange-500',
    bgLight: 'bg-orange-50',
    borderPrimary: 'border-orange-300',
    accentGradient: 'from-orange-500 to-orange-600',
    shadowColor: 'shadow-orange-500/50',
    ringColor: 'ring-orange-500/30',
    checkmarkColor: 'text-orange-500',
    footerLink: 'text-yellow-300 hover:text-yellow-200',
  },
  estande_azul: {
    id: 'D10',
    nome: 'Azul',
    bgGradient: 'from-blue-700 to-blue-800',
    primaryColor: '#003D82',
    primaryColorHex: '003D82',
    accentColor: '#0055A8',
    darkColor: '#002455',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
    buttonSecondary: 'bg-white text-blue-700 border-2 border-blue-700',
    textPrimary: 'text-blue-600',
    textLight: 'text-blue-500',
    bgLight: 'bg-blue-50',
    borderPrimary: 'border-blue-600',
    accentGradient: 'from-blue-600 to-blue-700',
    shadowColor: 'shadow-blue-500/50',
    ringColor: 'ring-blue-600/30',
    checkmarkColor: 'text-blue-600',
    footerLink: 'text-yellow-300 hover:text-yellow-200',
  },
};

export const getEstandeTheme = (idEstande) => {
  return ESTANDE_THEMES[idEstande] || ESTANDE_THEMES.estande_laranja;
};
