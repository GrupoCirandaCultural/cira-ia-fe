import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Registration from './components/Registration';
import PrizeWheel from './components/PrizeWheel';
import ChatInterface from './components/ChatInterface';
// ADICIONADO: Importação da nova tela de Check-in
import CheckInScreen from './components/CheckInScreen';
import { MapPin, Check } from 'lucide-react';

const ESTANDES = [
  { id: 'estande_norte', label: 'Pavilhão Norte' },
  { id: 'ciranda_bienal', label: 'Estande Principal' },
  { id: 'estande_sul', label: 'Pavilhão Sul' },
];

function App() {
  // Configuração inicial do Estande
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedEstande, setSelectedEstande] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('estande') || 'ciranda_bienal';
  });

  // Passos: 0: Welcome, 1: Registration, 2: Wheel, 3: Chat, 'checkin': CheckIn
  const [step, setStep] = useState(0);
  const [userLead, setUserLead] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [target, setTarget] = useState(null);
  const [prefilledPhone, setPrefilledPhone] = useState('')

  const qrCodeLinkParaCelular = window.location.href;

  // 2. LOGICA DE INÍCIO CENTRALIZADA
  const handleStart = (choice) => {
    if (choice === 'checkin') {
      setStep('checkin'); // Vai para a tela de rota de brindes
    } else {
      setTarget(choice);  // Guarda 'wheel' ou 'chat'
      setStep(1);         // Vai para o cadastro
    }
  };

  // 3. PÓS-CADASTRO: VALIDAÇÃO E NAVEGAÇÃO
  const handleRegistrationComplete = (userData, serverResponse) => {
    setUserLead(userData);
    setLeadId(serverResponse.id);

    // Se já participou, pula direto para o chat
    if (serverResponse.status === 'ja_participou') {
      setUserLead(prev => ({ ...prev, cupom: serverResponse.cupom }));
      setStep(3); 
      return;
    }

    // Navega conforme escolha inicial
    if (target === 'wheel') {
      setStep(2);
    } else if (target === 'checkin_redirect') {
      setStep('checkin'); // <--- Retorna para o checkin após cadastro
    } else {
      setStep(3); 
    }
  };

  const handleWheelFinish = (prize) => {
    setUserLead(prev => ({ ...prev, cupom: prize }));
    setStep(3);
  };

  return (
    // Container externo:
    // - Mobile/Tablet: Ocupa 100% da tela (w-full h-[100dvh]), fundo branco padrão.
    // - PC (lg+): Fundo cinza, centralizado, simulando ambiente de "estande" ou "desktop".
    <div className="w-full h-[100dvh] lg:min-h-screen lg:bg-gradient-to-br from-blue-400 to-pink-300  lg:flex lg:items-center lg:justify-center overflow-hidden">
      
      {/* Container da Aplicação:
          - Mobile/Tablet: 100% de largura e altura.
          - PC: Fixo (max-w-md), altura limitada, bordas arredondadas e sombra. */}
      <div className="relative w-full h-full lg:w-full lg:max-w-md lg:h-[90vh] lg:max-h-[850px] lg:rounded-2xl lg:shadow-2xl bg-white overflow-hidden">
        
        <div className="h-full w-full overflow-y-auto overflow-x-hidden relative bg-[#87CEEB]">
          
          {/* TELA DE CONFIGURAÇÃO INICIAL (SELEÇÃO DE ESTANDE) */}
          {!isConfigured && (
            <div className="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800 p-8 flex flex-col items-center justify-center text-white z-50 absolute inset-0">
               <div className="mb-8 p-4 bg-white/10 rounded-full border border-white/20">
                 <MapPin size={48} className="text-pink-500" />
               </div>
               
               <h1 className="text-2xl font-black mb-2 text-center">Configuração do Terminal</h1>
               <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">Selecione abaixo em qual estande este dispositivo está localizado.</p>

               <div className="w-full max-w-sm space-y-3">
                 {ESTANDES.map((estande) => (
                   <button
                     key={estande.id}
                     onClick={() => setSelectedEstande(estande.id)}
                     className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                       selectedEstande === estande.id 
                       ? 'bg-pink-600 border-pink-500 shadow-lg scale-105' 
                       : 'bg-white/5 border-white/10 hover:bg-white/10'
                     }`}
                   >
                      <span className="font-bold tracking-wide">{estande.label}</span>
                      {selectedEstande === estande.id && <Check size={20} className="text-white" />}
                   </button>
                 ))}
               </div>

               <button
                 onClick={() => setIsConfigured(true)}
                 className="mt-12 w-full max-w-sm py-4 bg-white text-gray-900 font-black rounded-2xl shadow-xl hover:bg-gray-100 transition-all active:scale-95"
               >
                 CONFIRMAR E INICIAR
               </button>
               
               <p className="fixed bottom-4 text-[10px] text-gray-600 font-mono">ID: {selectedEstande}</p>
            </div>
          )}

          {/* TELA DE CHECK-IN (FORA DO FLUXO PRINCIPAL) */}
          {isConfigured && step === 'checkin' && (
            <CheckInScreen 
              idEstande={selectedEstande} 
              onBack={() => setStep(0)} 
              onUserNotFound={(phone) => {
                setPrefilledPhone(phone);
                setTarget('checkin_redirect'); // <--- Marca que veio do checkin
                setStep(1); 
              }}
            />
          )}

          {/* TELA DE CONSULTA DE ESTOQUE - INTEGRADA NO CHAT AGORA, REMOVIDA DAQUI */}

          {/* PASSO 0: BOAS-VINDAS (COM ESCOLHA) */}
          {isConfigured && step === 0 && (
            <WelcomeScreen 
              onStart={handleStart} 
              qrLink={qrCodeLinkParaCelular} 
            />
          )}

          {/* PASSO 1: CADASTRO */}
          {isConfigured && step === 1 && (
            <Registration 
              idEstande={selectedEstande} 
              initialPhone={prefilledPhone}
              onBack={() => setStep(0)}
              onComplete={(userData, res) => {
                setPrefilledPhone('');
                handleRegistrationComplete(userData, res);
              }}
            />
          )}
          
          {/* PASSO 2: ROLETA */}
          {isConfigured && step === 2 && (
            <PrizeWheel 
              userId={leadId} 
              onFinish={handleWheelFinish} 
            />
          )}

          {/* PASSO 3: CHAT */}
          {isConfigured && step === 3 && (
            <ChatInterface 
              userName={userLead?.nome} 
              userPhone={userLead?.telefone}
              cupom={userLead?.cupom} 
              initialMode={target === 'chat_stock' ? 'stock' : 'chat'}
              idEstande={selectedEstande}
              onBack={() => setStep(0)}
            />
          )}
          
        </div>
      </div>
    </div>
  );
}

export default App;