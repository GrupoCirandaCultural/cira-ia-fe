import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Registration from './components/Registration';
import PrizeWheel from './components/PrizeWheel';
import ChatInterface from './components/ChatInterface';
import CheckInScreen from './components/CheckInScreen';
import EventSelector from './components/EventSelector';
import DiscountSuccess from './components/DiscountSuccess';
import { MapPin, Check } from 'lucide-react';
import { getEventoConfig, verificarEstandeValido } from './config/events.config';

function App() {
  // Estado consolidado com lazy initialization (parse URL apenas na carga inicial)
  const [appState, setAppState] = useState(() => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    let initialState = { 
      selectedEvento: null,
      selectedEstande: null,
      isConfigured: true,
      estandeOptions: []
    };

    // Valida URL e monta estado apenas se válida
    if (pathParts.length >= 2) {
      const evento = pathParts[0];
      const estande = pathParts[1];
      const config = getEventoConfig(evento);
      
      if (config && verificarEstandeValido(evento, estande)) {
        initialState = {
          selectedEvento: evento,
          selectedEstande: estande,
          estandeOptions: config.estandes,
          isConfigured: true
        };
      }
    }

    return initialState;
  });

  // Outros estados
  const [step, setStep] = useState(0);
  const [userLead, setUserLead] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [target, setTarget] = useState(null);
  const [prefilledPhone, setPrefilledPhone] = useState('');

  // Função para selecionar evento
  const handleSelectEvento = (eventoId) => {
    const config = getEventoConfig(eventoId);
    if (config) {
      // Apenas seleciona o evento, sem estande - vai mostrar o seletor
      window.history.pushState({}, '', `/${eventoId}`);
      setAppState({
        selectedEvento: eventoId,
        selectedEstande: null,
        estandeOptions: config.estandes,
        isConfigured: true
      });
    }
  };

  // Função para mudar de estande
  const handleChangeEstande = (estandeId) => {
    if (appState.selectedEvento && verificarEstandeValido(appState.selectedEvento, estandeId)) {
      window.history.pushState({}, '', `/${appState.selectedEvento}/${estandeId}`);
      setAppState(prev => ({
        ...prev,
        selectedEstande: estandeId
      }));
    }
  };

  // 2. LOGICA DE INÍCIO CENTRALIZADA
  const handleStart = (choice) => {
    if (choice === 'checkin') {
      setStep('checkin'); // Vai para a tela de rota de brindes
    } else {
      // Valida se o evento suporta a escolha (ex: wheel só se temRoleta)
      const eventoConfig = getEventoConfig(appState.selectedEvento);
      if (choice === 'wheel' && !eventoConfig?.temRoleta) {
        // Se tentou acessar wheel mas evento não tem, vai para chat
        setTarget('chat');
      } else {
        setTarget(choice);  // Guarda a escolha original
      }
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

    // Obtém config do evento para verificar se tem roleta
    const eventoConfig = getEventoConfig(appState.selectedEvento);
    
    // Navega conforme escolha inicial e disponibilidade de roleta
    if (target === 'wheel' && eventoConfig?.temRoleta) {
      // Vai para roleta se tem e foi escolhido
      setStep(2);
    } else if (target === 'checkin_redirect') {
      // Retorna para o checkin
      setStep('checkin');
    } else if (!eventoConfig?.temRoleta && appState.selectedEvento === 'bett_brasil') {
      // Bett Educar: Show discount success screen before chat
      setStep('discount-success');
    } else {
      // Chat direto (padrão ou se não tem roleta)
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
        
        <div className="h-full w-full overflow-hidden relative bg-[#87CEEB]">
          
          {/* TELA DE SELEÇÃO DE EVENTO (SE NÃO HOUVER EVENTO NA URL) */}
          {!appState.selectedEvento && appState.isConfigured && (
            <EventSelector onSelectEvent={handleSelectEvento} />
          )}

          {/* TELA DE SELEÇÃO DE ESTANDE (APENAS SE EVENTO FOI SELECIONADO MAS NÃO ESTANDE) */}
          {appState.selectedEvento && !appState.selectedEstande && appState.isConfigured && (
            <div className="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800 p-8 flex flex-col items-center justify-center text-white z-50 absolute inset-0">
               <div className="mb-8 p-4 bg-white/10 rounded-full border border-white/20">
                 <MapPin size={48} className="text-blue-400" />
               </div>
               
               <h1 className="text-2xl font-black mb-2 text-center">Configuração do Terminal</h1>
               <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">Selecione abaixo em qual estande este dispositivo está localizado.</p>

               <div className="w-full max-w-sm space-y-3">
                 {appState.estandeOptions.map((estande) => (
                   <button
                     key={estande.id}
                     onClick={() => {
                       handleChangeEstande(estande.id);
                     }}
                     className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                       appState.selectedEstande === estande.id 
                       ? 'bg-blue-600 border-blue-500 shadow-lg scale-105' 
                       : 'bg-white/5 border-white/10 hover:bg-white/10'
                     }`}
                     style={appState.selectedEstande === estande.id ? { backgroundColor: estande.cor, borderColor: estande.cor } : {}}
                   >
                      <div className="text-left">
                        <span className="font-bold tracking-wide block">{estande.label}</span>
                        {estande.numero && <span className="text-xs text-gray-300">Número: {estande.numero}</span>}
                      </div>
                      {appState.selectedEstande === estande.id && <Check size={20} className="text-white" />}
                   </button>
                 ))}
               </div>

               <p className="fixed bottom-4 text-[10px] text-gray-600 font-mono">
                 Evento: {appState.selectedEvento} | Estande: {appState.selectedEstande}
               </p>
            </div>
          )}

          {/* TELA DE CHECK-IN (FORA DO FLUXO PRINCIPAL) */}
          {appState.isConfigured && step === 'checkin' && (
            <CheckInScreen 
              eventoId={appState.selectedEvento}
              idEstande={appState.selectedEstande} 
              onBack={() => setStep(0)} 
              onUserNotFound={(phone) => {
                setPrefilledPhone(phone);
                setTarget('checkin_redirect');
                setStep(1); 
              }}
            />
          )}

          {/* PASSO 0: BOAS-VINDAS (COM ESCOLHA) */}
          {appState.isConfigured && appState.selectedEstande && step === 0 && (
            <WelcomeScreen 
              onStart={handleStart} 
              idEstande={appState.selectedEstande}
              eventoId={appState.selectedEvento}
            />
          )}

          {/* PASSO 1: CADASTRO */}
          {appState.isConfigured && step === 1 && (
            <Registration 
              idEstande={appState.selectedEstande}
              eventoId={appState.selectedEvento}
              initialPhone={prefilledPhone}
              onBack={() => setStep(0)}
              onComplete={(userData, res) => {
                setPrefilledPhone('');
                handleRegistrationComplete(userData, res);
              }}
            />
          )}
          
          {/* TELA DE SUCESSO - BETT EDUCAR */}
          {appState.isConfigured && step === 'discount-success' && (
            <DiscountSuccess 
              idEstande={appState.selectedEstande}
              eventoId={appState.selectedEvento}
              userName={userLead?.nome}
              onExplore={() => setStep(3)}
              onBack={() => setStep(0)}
            />
          )}
          
          {/* PASSO 2: ROLETA */}
          {appState.isConfigured && step === 2 && (
            <PrizeWheel 
              userId={leadId} 
              idEstande={appState.selectedEstande}
              onFinish={handleWheelFinish} 
            />
          )}

          {/* PASSO 3: CHAT */}
          {appState.isConfigured && step === 3 && (
            <ChatInterface 
              userName={userLead?.nome} 
              userPhone={userLead?.telefone}
              cupom={userLead?.cupom} 
              initialMode={target === 'chat_stock' ? 'stock' : 'chat'}
              idEstande={appState.selectedEstande}
              onBack={() => setStep(0)}
            />
          )}
          
        </div>
      </div>
    </div>
  );
}

export default App;