import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Mic, Search, Send, Square, X } from 'lucide-react';

export default function ChatInput({ value, onChange, onSubmit, searchMode, onToggleSearchMode, disabled }) {
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const addFiles = (files, type) => {
    const nextAttachments = Array.from(files || []).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      type,
      previewUrl: URL.createObjectURL(file),
    }));
    setAttachments((current) => [...current, ...nextAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments((current) => {
      const attachment = current.find((item) => item.id === id);
      if (attachment) URL.revokeObjectURL(attachment.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const stopRecording = () => recorderRef.current?.stop();

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      audioInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size) addFiles([new File([blob], `gravacao-${Date.now()}.webm`, { type: blob.type })], 'audio');
      };
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Não foi possível acessar o microfone:', error);
      audioInputRef.current?.click();
    }
  };

  const submit = () => {
    const text = value.trim();
    if (!text && attachments.length === 0) return;
    onSubmit({ text, attachments });
    setAttachments([]);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="px-3 py-3 bg-[var(--background)] border-t border-[var(--border)]"
    >
      {!searchMode && attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" aria-label="Anexos selecionados">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--card)]">
              {attachment.type === 'image' ? (
                <img src={attachment.previewUrl} alt={`Prévia de ${attachment.file.name}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center px-1">
                  <audio controls src={attachment.previewUrl} aria-label={`Prévia de áudio: ${attachment.file.name}`} className="w-full" />
                </div>
              )}
              <button type="button" onClick={() => removeAttachment(attachment.id)} aria-label={`Remover ${attachment.file.name}`} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-[var(--foreground)] text-[var(--card)] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--primary)]">
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
      {!searchMode && (
        <button
          type="button"
          aria-label="Buscar por título, autor ou ISBN"
          onClick={onToggleSearchMode}
          className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        >
          <Search size={20} aria-hidden="true" />
        </button>
      )}

      {!searchMode && (
        <>
          <input ref={imageInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files, 'image'); event.target.value = ''; }} />
          <input ref={audioInputRef} type="file" accept="audio/*" className="sr-only" onChange={(event) => { addFiles(event.target.files, 'audio'); event.target.value = ''; }} />
          <button type="button" title="Adicionar imagem" aria-label="Adicionar imagens" onClick={() => imageInputRef.current?.click()} className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">
            <ImagePlus size={20} aria-hidden="true" />
          </button>
          <button type="button" title={isRecording ? 'Parar gravação' : 'Gravar áudio'} aria-label={isRecording ? 'Parar gravação' : 'Gravar áudio'} onClick={isRecording ? stopRecording : startRecording} className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--primary)] ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)]'}`}>
            {isRecording ? <Square size={17} fill="currentColor" aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
          </button>
        </>
      )}

      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={searchMode ? 'Título, autor ou ISBN…' : 'Pergunte à Cira…'}
          aria-label={searchMode ? 'Buscar no catálogo' : 'Escreva sua mensagem para a Cira'}
          className="w-full h-11 rounded-full bg-[var(--card)] border border-[var(--border)] px-4 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        />
        {searchMode && (
          <button
            type="button"
            aria-label="Sair do modo de busca"
            onClick={onToggleSearchMode}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled}
        aria-label={searchMode ? 'Buscar' : 'Enviar mensagem'}
        className="w-11 h-11 shrink-0 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-sm active:scale-95 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
      >
        {searchMode ? <Search size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
      </button>
      </div>
    </form>
  );
}
