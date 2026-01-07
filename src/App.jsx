import React, { useState, useMemo } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Registration from './components/Registration';
import PrizeWheel from './components/PrizeWheel';
import ChatInterface from './components/ChatInterface';
// ADICIONADO: Importação da nova tela de Check-in
import CheckInScreen from './components/CheckInScreen';
// import StockConsultation from './components/StockConsultation'; // REMOVIDO/DESATIVADO

function App() {
  // Passos: 0: Welcome, 1: Registration, 2: Wheel, 3: Chat, 'checkin': CheckIn
  const [step, setStep] = useState(0);
  const [userLead, setUserLead] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [target, setTarget] = useState(null);
  const [prefilledPhone, setPrefilledPhone] = useState('')

  // 1. CAPTURA DINÂMICA DO ESTANDE VIA URL
  const estandeViaURL = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('estande') || 'geral';
  }, []);

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
          
          {/* TELA DE CHECK-IN (FORA DO FLUXO PRINCIPAL) */}
          {step === 'checkin' && (
            <CheckInScreen 
              idEstande={estandeViaURL} 
              onBack={() => setStep(0)} 
              onUserNotFound={(phone) => {
                setPrefilledPhone(phone);
                setStep(1); 
              }}
            />
          )}

          {/* TELA DE CONSULTA DE ESTOQUE - INTEGRADA NO CHAT AGORA, REMOVIDA DAQUI */}

          {/* PASSO 0: BOAS-VINDAS (COM ESCOLHA) */}
          {step === 0 && (
            <WelcomeScreen 
              onStart={handleStart} 
              qrLink={qrCodeLinkParaCelular} 
            />
          )}

          {/* PASSO 1: CADASTRO */}
          {step === 1 && (
            <Registration 
              idEstande={estandeViaURL} 
              initialPhone={prefilledPhone}
              onBack={() => setStep(0)}
              onComplete={(userData, res) => {
                setPrefilledPhone('');
                handleRegistrationComplete(userData, res);
              }}
            />
          )}
          
          {/* PASSO 2: ROLETA */}
          {step === 2 && (
            <PrizeWheel 
              userId={leadId} 
              onFinish={handleWheelFinish} 
            />
          )}

          {/* PASSO 3: CHAT */}
          {step === 3 && (
            <ChatInterface 
              userName={userLead?.nome} 
              cupom={userLead?.cupom} 
              initialMode={target === 'chat_stock' ? 'stock' : 'chat'}
              idEstande={estandeViaURL}
              onBack={() => setStep(0)}
            />
          )}
          
        </div>
      </div>
    </div>
  );
}

export default App;