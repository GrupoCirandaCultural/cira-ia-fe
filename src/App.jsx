import React, { useState, useMemo } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Registration from './components/Registration';
import PrizeWheel from './components/PrizeWheel';
import ChatInterface from './components/ChatInterface';
// ADICIONADO: Importação da nova tela de Check-in
import CheckInScreen from './components/CheckInScreen';

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
    target === 'wheel' ? setStep(2) : setStep(3);
  };

  const handleWheelFinish = (prize) => {
    setUserLead(prev => ({ ...prev, cupom: prize }));
    setStep(3);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 to-pink-300 flex items-center justify-center p-0 sm:p-4 md:p-8">
      
      <div className="w-full max-w-md h-[100dvh] sm:h-[90vh] md:aspect-[9/16] bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative sm:border-[4px] border-gray-800 ring-4 ring-black/10">
        
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
            />
          )}
          
        </div>
      </div>
    </div>
  );
}

export default App;