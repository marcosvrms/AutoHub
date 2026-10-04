'use client';

import React from 'react';

/**
 * GlobalBackground — Mapa tecnológico mundial como plano de fundo fixo.
 * Referência visual: mapa mundi com pontos e linhas de conectividade.
 * Imagem de referência fornecida pelo usuário (URL externa para demonstração).
 */
export function GlobalBackground() {
  return (
    <>
      {/* Camada da imagem de fundo */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url('https://img.magnific.com/fotos-premium/elementos-tecnologicos-em-um-fundo-de-mapa-digital-do-mundo-conceito-tecnologia-mapa-digital-do-mundo-elementos-de-fundo-de-mapa-global-conectividade-global_918839-381514.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Camada escura sobre a imagem para legibilidade */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,10,24,0.82) 0%, rgba(4,8,20,0.88) 50%, rgba(6,10,24,0.92) 100%)',
        }}
      />

      {/* Vinheta lateral suave */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,8,20,0.60) 100%)',
        }}
      />

      {/* Grade tecnológica discreta */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </>
  );
}
