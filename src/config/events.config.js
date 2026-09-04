/**
 * CONFIGURAÇÃO CENTRALIZADA DE EVENTOS
 * Define estandes, campos obrigatórios e regras por evento
 * URL Format: /{evento}/{estande}
 * Ex: /bett_brasil/estande_laranja, /bienal_2026/bienal_geral
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
        numero: 'D10',
        cor: '#FF8C42'
      },
      {
        id: 'estande_azul',
        label: 'Estande Azul',
        numero: 'N164',
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
        primaryColor: '#F9B334',
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
    temRoleta: false,
    
    estandes: [
      {
        id: 'bienal_geral',
        label: 'Bienal 2026',
        numero: null,
        cor: '#005BAA'
      }
    ],

    codigosEstoque: ['000111', '000112', '000356', '000357', '000358', '000359', '000360', '000361'],

    mapaEstandes: [
      {
        id: 'ciranda_cultural',
        label: 'Ciranda Cultural',
        numero: 'A30/A88/DD11',
        cor: '#005BAA',
        codigosEstoque: ['000361']
      },
      {
        id: 'grupo_magic',
        label: 'Grupo Magic',
        numero: 'C60/A89',
        cor: '#FFE500',
        codigosEstoque: ['000111', '000112']
      },
      {
        id: 'w_books',
        label: 'W. Books',
        numero: 'B20',
        cor: '#F51B13'
      },
      {
        id: 'ciranda_na_escola',
        label: 'Ciranda na Escola',
        numero: 'B20',
        cor: '#FF8200',
        codigosEstoque: ['000358']
      },
      {
        id: 'editora_kairos',
        label: 'Editora Kairós',
        numero: 'F30',
        cor: '#FF7A3D'
      },
      {
        id: 'trend_editora',
        label: 'Trend Editora',
        numero: 'F30',
        cor: '#FFD900'
      },
      {
        id: 'principis',
        label: 'Principis',
        numero: 'F30',
        cor: '#008F78',
        codigosEstoque: ['000359']
      },
      {
        id: 'mood',
        label: '_mood',
        numero: 'C10',
        cor: '#F04F98',
        codigosEstoque: ['000360']
      }
    ],

    eventosEstoque: [
      { codigo: '000111', empresa: '07' },
      { codigo: '000112', empresa: '07' },
      { codigo: '000356' },
      { codigo: '000357' },
      { codigo: '000358' },
      { codigo: '000359' },
      { codigo: '000360' },
      { codigo: '000361' }
    ],

    mapaPorCodigoEvento: {
      '000111': { nome: 'Magic Kids', estande: '300 M', x: '20%', y: '35%', color: '#ea08db' },
      '000112': { nome: 'Magic Kids', estande: '100 M', x: '2%', y: '65%', color: '#08ea1b', align: 'left' },
      '000356': { nome: 'Escolar', estande: '150 M', x: '3%', y: '53%', color: '#5215fa', align: 'left' },
      '000357': { nome: 'Professor', estande: '125 M', x: '91%', y: '42%', color: '#22D3EE', align: 'right' },
      '000358': { nome: 'Ciranda na Escola', estande: 'B20', x: '52%', y: '44%', color: '#FACC15' },
      '000359': { nome: 'Principis', estande: 'F30', x: '41%', y: '6%', color: '#008F78' },
      '000360': { nome: 'Mood', estande: 'C10', x: '60%', y: '34%', color: '#9D174D' },
      '000361': { nome: 'Ciranda', estande: 'A30/A88/DD11', x: '41%', y: '57%', color: '#EC0E8C' }
    },
    
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
      bienal_geral: {
        primaryColor: '#005BAA',
        secondaryColor: '#FF8200',
        accentColor: '#F04F98',
        darkColor: '#003B73'
      },
      ciranda_cultural: {
        primaryColor: '#005BAA',
        secondaryColor: '#0074CC',
        accentColor: '#36A3FF',
        darkColor: '#003B73'
      },
      grupo_magic: {
        primaryColor: '#FFE500',
        secondaryColor: '#F5C400',
        accentColor: '#005BAA',
        darkColor: '#8A6D00',
        buttonColor: '#005BAA'
      },
      w_books: {
        primaryColor: '#F51B13',
        secondaryColor: '#FF4A1C',
        accentColor: '#FF8200',
        darkColor: '#B5120D'
      },
      ciranda_na_escola: {
        primaryColor: '#FF8200',
        secondaryColor: '#FF9F1A',
        accentColor: '#FFD166',
        darkColor: '#B85600'
      },
      editora_kairos: {
        primaryColor: '#FF7A3D',
        secondaryColor: '#FF5A1F',
        accentColor: '#FFD166',
        darkColor: '#B43B0F'
      },
      trend_editora: {
        primaryColor: '#FFD900',
        secondaryColor: '#F5B800',
        accentColor: '#111827',
        darkColor: '#8A6500',
        buttonColor: '#111827'
      },
      principis: {
        primaryColor: '#008F78',
        secondaryColor: '#00A98E',
        accentColor: '#6EE7B7',
        darkColor: '#005E4F'
      },
      mood: {
        primaryColor: '#F04F98',
        secondaryColor: '#F77AB4',
        accentColor: '#F9A8D4',
        darkColor: '#B91D63'
      }
    }
  },

  central: {
    id: 'central',
    nome: 'Central',
    descricao: 'Ambiente de referência para validar o novo design do chat da Cira',
    imagem: 'https://via.placeholder.com/400x300?text=Central',
    temRoleta: false,

    // Tab de referência de design: apenas 1 "estande" (auto-selecionado),
    // sem cadastro/roleta — vai direto para a nova tela de chat mockada.
    estandes: [
      {
        id: 'central_home',
        label: 'Central',
        numero: null,
        cor: '#C9884D'
      }
    ],

    camposObrigatorios: [],
    opcoesAtividade: [],

    temaPorEstande: {
      central_home: {
        primaryColor: '#C9884D',
        secondaryColor: '#D9A15E',
        accentColor: '#D9A15E',
        darkColor: '#8F5F2F'
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

export function getNomeExibicaoEstoque(codigo, fallback = '') {
  const codigoNormalizado = String(codigo || '').trim();
  const evento = Object.values(EVENTOS_CONFIG).find((config) => (
    config.mapaPorCodigoEvento?.[codigoNormalizado]
  ));
  const mapaInfo = evento?.mapaPorCodigoEvento?.[codigoNormalizado];

  if (mapaInfo) {
    return `${mapaInfo.nome} ${mapaInfo.estande}`.trim();
  }

  if (!fallback) return 'Evento';
  return String(fallback).split('-')[0].trim();
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

export function getOutroEstande(eventoId, estandeAtualId) {
  const evento = EVENTOS_CONFIG[eventoId];
  if (!evento) return null;
  
  return evento.estandes.find(e => e.id !== estandeAtualId) || null;
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
