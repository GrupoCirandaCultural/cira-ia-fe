// src/components/Registration.jsx
import React, { useState, useMemo } from 'react';
import api from '../api';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { getEstandeTheme } from '../theme';
import { getCamposRegistration, getOpcoesAtividade } from '../config/events.config';
import CustomSelect from './CustomSelect';
import imagemEscola from '../assets/ciranda_escola_sem_fundo.png';

export default function Registration({ onComplete, idEstande, eventoId = 'bett_brasil', initialPhone, onBack }) {
  const theme = getEstandeTheme(idEstande);
  
  // Campos dinâmicos baseado no evento
  const camposObrigatorios = useMemo(() => getCamposRegistration(eventoId), [eventoId]);
  const opcoesAtividadeEvento = useMemo(() => getOpcoesAtividade(eventoId), [eventoId]);
  
  // Estado inicial dinâmico
  const [formData, setFormData] = useState(() => {
    const inicial = { 
      nome: '', 
      telefone: initialPhone || '', 
      email: '', 
      estado: '', 
      atividade: '',
      atividadeOutro: '',
      aceito: false 
    };
    // Remove campos que não são obrigatórios neste evento
    camposObrigatorios.forEach(campo => {
      // Garante que os campos obrigatórios existem
      if (!(campo in inicial)) inicial[campo] = '';
    });
    return inicial;
  });
  
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [customAlert, setCustomAlert] = useState(null);

  const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  // Helper para checar se campo é obrigatório
  const isCampoObrigatorio = (campo) => camposObrigatorios.includes(campo);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    setFormData({...formData, telefone: value});
  };

  const closeAlert = () => {
    if (customAlert?.onConfirm) {
       customAlert.onConfirm();
    }
    setCustomAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        const { data } = await api.post('/leads/check-in', {
          telefone: formData.telefone,
          id_estande: idEstande,
          id_evento: eventoId
        });

        if (data.status === 'nao_encontrado') {
          setCustomAlert({
             title: "Cadastro não encontrado",
             message: "Não encontramos este número. Por favor, preencha seus dados para continuar.",
             onConfirm: () => setIsLoginMode(false)
          });
        } else {
          let nomeUsuario = data.nome;
          
          if (!nomeUsuario) {
            try {
              const resBusca = await api.get(`/leads?telefone=${formData.telefone}`);
              const leadEncontrado = Array.isArray(resBusca.data) ? resBusca.data[0] : resBusca.data;
              if (leadEncontrado && leadEncontrado.nome) {
                nomeUsuario = leadEncontrado.nome;
              }
            } catch (err) {
              console.error("Erro ao buscar nome:", err);
            }
          }

          onComplete({ nome: nomeUsuario || 'Visitante', telefone: formData.telefone, cupom: data.cupom }, data);
        }
      } else {
        if (formData.nome.trim().length < 3) {
             setCustomAlert({
                title: "Nome muito curto",
                message: "Por favor, digite seu nome completo.",
                type: "error"
             });
             setLoading(false);
             return;
        }

        const payload = { 
          ...formData, 
          nome: (formData.nome || '').replace(/[\n\t\r]/g, ' ').replace(/\s{2,}/g, ' ').trim(),
          id_estande: idEstande,
          id_evento: eventoId,
          // Se atividade é 'outro', usa o valor customizado
          ...(formData.atividade === 'outro' && { atividade: formData.atividadeOutro })
        };
        const res = await api.post('/leads', payload);
        onComplete(formData, res.data);
      }
    } catch (error) {
      console.error("Erro ao processar:", error);
      setCustomAlert({
        title: "Ops, algo deu errado!",
        message: "Ocorreu um erro ao processar sua solicitação. Verifique sua conexão e tente novamente.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full w-full ${theme.bgLight} p-3 sm:p-6 overflow-y-auto`}>
      <div className={`bg-white p-5 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border-t-8 ${theme.borderPrimary} relative my-auto`}>
        {onBack && (
          <button onClick={onBack} className="absolute top-3 left-3 sm:top-4 sm:left-4 text-gray-400 transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => e.target.style.color = theme.primaryColor} onMouseLeave={(e) => e.target.style.color = 'inherit'} title="Voltar">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        {eventoId === 'bett_brasil' ? (
          <img 
            src={imagemEscola} 
            alt="Escola Logo" 
            className="h-12 sm:h-16 mt-1 sm:mt-2 mb-2 sm:mb-3 mx-auto"
          />
        ) : (
          <h2 className={`text-2xl sm:text-3xl font-black ${theme.textPrimary} mb-2 text-center`}>Cira IA</h2>
        )}
        <p className="text-gray-500 text-center mb-4 sm:mb-6 text-sm sm:text-base font-medium">
          {isLoginMode ? 'Informe seu WhatsApp para entrar' : 'Cadastre-se para participar!'}
        </p>
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-4 sm:mb-6">
          <button 
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${!isLoginMode ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            style={!isLoginMode ? { color: theme.primaryColor } : {}}
          >
            Novo Cadastro
          </button>
          <button 
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${isLoginMode ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            style={isLoginMode ? { color: theme.primaryColor } : {}}
          >
            Já tenho cadastro
          </button>
        </div>
        
        {customAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setCustomAlert(null)} 
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-inner ${customAlert.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-pink-100 text-pink-500'}`}>
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-800">{customAlert.title}</h3>
                <p className="text-gray-500 text-sm font-medium px-2">{customAlert.message}</p>
                
                <button 
                  onClick={closeAlert}
                  className={`w-full text-white font-black py-3 rounded-xl shadow-lg mt-4 active:scale-95 transition-all ${customAlert.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'}`}
                >
                  {customAlert.type === 'error' ? 'Tentar Novamente' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLoginMode && (
            <input 
              required 
              placeholder="Nome Completo *"
              className="w-full p-3 sm:p-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-100 rounded-xl outline-none transition-all text-gray-400"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
            />
          )}
          
          <input 
            required 
            type="tel"
            placeholder="WhatsApp *"
            className="w-full p-3 sm:p-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-100 rounded-xl outline-none transition-all text-gray-400"
            value={formData.telefone}
            onChange={handlePhoneChange}
            maxLength={15}
          />

          {!isLoginMode && (
            <>
              {/* Campo Email - Dinâmico */}
              {isCampoObrigatorio('email') && (
                <input 
                  type="email"
                  required
                  placeholder="E-mail *"
                  className="w-full p-3 sm:p-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-100 rounded-xl outline-none transition-all text-gray-400"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              )}
              
              {/* Campo Estado - Dinâmico */}
              {isCampoObrigatorio('estado') && (
                <CustomSelect
                  value={formData.estado}
                  onChange={(value) => setFormData({...formData, estado: value})}
                  placeholder="Selecione seu Estado *"
                  options={estados.map(est => ({ value: est, label: est }))}
                  required
                  openDirection="auto"
                />
              )}

              {/* Campo Atividade - Dinâmico com opções do evento */}
              {isCampoObrigatorio('atividade') && opcoesAtividadeEvento.length > 0 && (
                <>
                  <CustomSelect
                    value={formData.atividade}
                    onChange={(value) => setFormData({...formData, atividade: value, atividadeOutro: value === 'outro' ? formData.atividadeOutro : ''})}
                    placeholder="Qual sua atividade principal? *"
                    options={opcoesAtividadeEvento.map(ativ => ({ value: ativ.id, label: ativ.label }))}
                    required
                    openDirection="auto"
                  />
                  
                  {/* Campo de input para atividade customizada quando "Outro" é selecionado */}
                  {formData.atividade === 'outro' && (
                    <input 
                      type="text"
                      required
                      placeholder="Digite sua atividade *"
                      className="w-full p-3 sm:p-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-100 rounded-xl outline-none transition-all"
                      value={formData.atividadeOutro}
                      onChange={e => setFormData({...formData, atividadeOutro: e.target.value})}
                    />
                  )}
                </>
              )}
              
              <label className="flex items-start gap-3 p-1 sm:p-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-0.5 w-5 h-5 shrink-0"
                  checked={formData.aceito}
                  onChange={e => setFormData({...formData, aceito: e.target.checked})}
                  style={{ accentColor: theme.primaryColor }}
                />
                <span className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                  Aceito compartilhar meus dados para receber novidades da Ciranda Cultural. *
                </span>
              </label>
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full text-white font-black py-3 sm:py-4 text-sm sm:text-base rounded-2xl shadow-lg transition-all uppercase tracking-widest disabled:bg-gray-400"
            style={{ backgroundColor: theme.primaryColor ?? ''}}
          >
            {loading ? 'Processando...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>
      </div>
    </div>
  );
}