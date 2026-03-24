'use client';

import { useState, useEffect } from 'react';

export default function PreviewPage() {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'danger'>('idle');
  const [progress, setProgress] = useState(0);
  const [details, setDetails] = useState('');

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('verifying');
    setProgress(0);
    setDetails('Iniciando protocolos de segurança...');

    // Simulate progress
    const intervals = [
      { p: 20, d: 'Analisando cabeçalhos da requisição...' },
      { p: 45, d: 'Verificando padrões de injeção SQL...' },
      { p: 70, d: 'Validando scripts maliciosos (XSS)...' },
      { p: 90, d: 'Checando reputação do IP...' },
      { p: 100, d: 'Verificação concluída!' },
    ];

    for (const step of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(step.p);
      setDetails(step.d);
    }

    setStatus('success');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Demonstração de Segurança</h1>
      <p>Este formulário simula o envio de email com uma camada de cybersecurity ativa (FastAPI).</p>

      <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <input type="text" placeholder="Seu Nome" disabled={status !== 'idle'} />
        <input type="email" placeholder="Seu Email" disabled={status !== 'idle'} />
        <textarea placeholder="Sua Mensagem" rows={4} disabled={status !== 'idle'} required />
        
        {status === 'idle' && (
          <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Enviar Mensagem (Com Verificação)
          </button>
        )}
      </form>

      {status !== 'idle' && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
          <h3>Status da Verificação</h3>
          
          {status === 'verifying' && (
            <div>
              <div style={{ width: '100%', backgroundColor: '#eee', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#0070f3', transition: 'width 0.3s ease' }}></div>
              </div>
              <p style={{ color: '#666', fontStyle: 'italic' }}>{details}</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ color: '#28a745' }}>
              <span style={{ fontSize: '3rem' }}>✓</span>
              <p><strong>Aprovado!</strong> A mensagem passou em todos os testes de segurança.</p>
              <button 
                onClick={() => setStatus('idle')}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', border: '1px solid #28a745', background: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Resetar Simulação
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#666' }}>
        <p><em>Obs: Esta é uma prévia visual. O código do FastAPI fornecido executa exatamente esses testes no servidor.</em></p>
      </div>
    </div>
  );
}
