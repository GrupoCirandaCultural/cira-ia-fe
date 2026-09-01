// Conteúdo estático de UI (chips e nome de saudação), no mesmo espírito das
// opções hardcoded do ChatInterface.jsx real (tagOptions/ageOptions). Não é
// mais usado para simular respostas: o texto e os livros vêm da API real
// (POST /chat em src/api.js), igual às demais telas do app.

export const MOCK_USER_NAME = 'Felipe';

export const THEME_CHIPS = [
  { label: 'Sentimentos', value: 'Recomende livros sobre Sentimentos' },
  { label: 'Inclusão', value: 'Gostaria de conhecer livros sobre Inclusão' },
  { label: 'Indígena', value: 'Mostre-me livros com temática Indígena' },
  { label: 'Alfabetização', value: 'Procuro livros de Alfabetização' },
  { label: 'Sustentabilidade', value: 'Recomende livros sobre Sustentabilidade' },
];

export const REFINEMENT_CHIPS = [
  { label: 'Criança', value: 'Quero indicações para Criança' },
  { label: 'Adolescente', value: 'Quero indicações para Adolescente' },
  { label: 'Adulto', value: 'Quero indicações para Adulto' },
  { label: 'Livro de atividades', value: 'Quero um livro de atividades' },
];
