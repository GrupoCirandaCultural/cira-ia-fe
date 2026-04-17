/**
 * CONFIGURAÇÃO CENTRALIZADA DE EVENTOS
 * Define estandes, campos obrigatórios e regras por evento
 * URL Format: /{evento}/{estande}
 * Ex: /bett_brasil/estande_laranja, /bienal_2026/ciranda_bienal
 */

export const EVENTOS_CONFIG = {
  bett_brasil: {
    id: 'bett_brasil',
    nome: 'BETT Educar 2026',
    descricao: 'Maior evento de educação da América Latina',
    imagem: 'https://via.placeholder.com/400x300?text=BETT+Educar',
    temRoleta: false, // Bett Educar não tem roleta
    
    estandes: [
      {
        id: 'estande_laranja',
        label: 'Estande Laranja',
        numero: 'N164',
        cor: '#FF8C42'
      },
      {
        id: 'estande_azul',
        label: 'Estande Azul',
        numero: 'D10',
        cor: '#003D82'
      }
    ],
    
    // Campos obrigatórios da Registration
    camposObrigatorios: ['nome', 'telefone', 'email', 'estado', 'atividade'],
    
    // Opções de atividade para este evento
    opcoesAtividade: [
      { id: 'educador', label: 'Educador' },
      { id: 'gestor', label: 'Gestor Educacional' },
      { id: 'estudante', label: 'Estudante' },
      { id: 'pai', label: 'Pai/Responsável' },
      { id: 'livreiro', label: 'Livreiro' },
      { id: 'bibliotecario', label: 'Bibliotecário' },
      { id: 'outro', label: 'Outro' }
    ],

    // Temas por estande
    temaPorEstande: {
      estande_laranja: {
        primaryColor: '#ea580c',
        secondaryColor: '#ff7a2a',
        accentColor: '#ff7a2a',
        darkColor: '#d94a08',
        buttonColor: '#2563eb'
      },
      estande_azul: {
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6',
        accentColor: '#3b82f6',
        darkColor: '#1e40af',
        buttonColor: '#ea580c'
      }
    }
  },

  bienal_2026: {
    id: 'bienal_2026',
    nome: 'Bienal do Livro 2026',
    descricao: 'A maior festa do livro do Brasil',
    imagem: 'https://via.placeholder.com/400x300?text=Bienal+2026',
    temRoleta: true, // Bienal tem roleta
    
    estandes: [
      {
        id: 'estande_norte',
        label: 'Pavilhão Norte',
        numero: 'Pavilhão Norte',
        cor: '#4CAF50'
      },
      {
        id: 'ciranda_bienal',
        label: 'Estande Principal Ciranda',
        numero: 'Estande Principal Ciranda',
        cor: '#FF6B6B'
      },
      {
        id: 'estande_sul',
        label: 'Pavilhão Sul',
        numero: 'Pavilhão Sul',
        cor: '#2196F3'
      }
    ],
    
    // Campos obrigatórios da Registration (sem estado/atividade)
    camposObrigatorios: ['nome', 'telefone', 'email'],
    
    // Opções de atividade para este evento (diferente do bett_brasil)
    opcoesAtividade: [
      { id: 'visitante', label: 'Visitante' },
      { id: 'profissional', label: 'Profissional Livro' },
      { id: 'imprensa', label: 'Imprensa' }
    ],

    // Temas por estande
    temaPorEstande: {
      estande_norte: {
        primaryColor: '#4CAF50',
        secondaryColor: '#66BB6A',
        accentColor: '#66BB6A',
        darkColor: '#2E7D32'
      },
      ciranda_bienal: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#EF5350',
        accentColor: '#EF5350',
        darkColor: '#C62828'
      },
      estande_sul: {
        primaryColor: '#2196F3',
        secondaryColor: '#42A5F5',
        accentColor: '#42A5F5',
        darkColor: '#1565C0'
      }
    }
  }
};

/**
 * FUNÇÕES AUXILIARES
 */

export function getEventoConfig(eventoId) {
  return EVENTOS_CONFIG[eventoId] || null;
}

export function getEstandeConfig(eventoId, estandeId) {
  const evento = EVENTOS_CONFIG[eventoId];
  if (!evento) return null;
  
  return evento.estandes.find(e => e.id === estandeId) || null;
}

export function getTemaEstande(eventoId, estandeId) {
  const evento = EVENTOS_CONFIG[eventoId];
  if (!evento) return null;
  
  return evento.temaPorEstande[estandeId] || null;
}

export function verificarEstandeValido(eventoId, estandeId) {
  const evento = EVENTOS_CONFIG[eventoId];
  if (!evento) return false;
  
  return evento.estandes.some(e => e.id === estandeId);
}

export function getCamposRegistration(eventoId) {
  const evento = EVENTOS_CONFIG[eventoId];
  if (!evento) return [];
  
  return evento.camposObrigatorios;
}

export function getOpcoesAtividade(eventoId) {
  const evento = EVENTOS_CONFIG[eventoId];
  if (!evento) return [];
  
  return evento.opcoesAtividade;
}

export function listarEventos() {
  return Object.values(EVENTOS_CONFIG).map(evento => ({
    id: evento.id,
    nome: evento.nome,
    descricao: evento.descricao,
    imagem: evento.imagem,
    numEstandes: evento.estandes.length
  }));
}
