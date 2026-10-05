'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Zap, TrendingUp } from 'lucide-react';
import { formatTime, formatDate } from '@/src/utils';
import type { VehicleModel, UserPublic } from '@/src/types';

interface TopStatusBarProps {
  model: VehicleModel | null;
  user?: UserPublic | null;
}

/**
 * TopStatusBar — Barra de status superior do catálogo (estilo GT7)
 * 
 * Exibe: perfil do usuário | veículo selecionado | relógio/data
 */
export function TopStatusBar({ model, user }: TopStatusBarProps) {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(formatTime(now));
      setDateStr(
        now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-white/6 bg-[rgba(6,10,24,0.60)] backdrop-blur-xl">

      {/* ---- Esquerda: Usuário ---- */}
      <div className="flex items-center gap-3 min-w-[200px]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full border border-white/15 overflow-hidden bg-gradient-to-br from-[#00D4FF]/20 to-[#B500FF]/20 flex items-center justify-center shrink-0">
          {user?.photo ? (
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User size={14} className="text-white/40" />
          )}
        </div>
        <div>
          <p className="text-white text-xs font-medium leading-tight">
            {user?.name ?? 'Visitante'}
          </p>
          <p className="text-white/30 text-[10px] leading-tight">
            {user?.city && user?.state ? `${user.city}, ${user.state}` : 'AutoHub'}
          </p>
        </div>
      </div>

      {/* ---- Centro: Veículo selecionado ---- */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {model ? (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3"
            >
              {/* Thumb */}
              <div className="w-[52px] h-[32px] rounded border border-white/10 overflow-hidden bg-white/3">
                <img
                  src={model.catalogImage || 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg'}
                  alt={model.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Info */}
              <div className="text-center">
                <p className="text-white text-xs font-semibold leading-tight">
                  {model.manufacturer?.name} {model.name}
                </p>
                <p className="text-white/40 text-[9px] uppercase tracking-widest">
                  {model.vehicleType?.name} · {model.manufactureYear}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-white/20"
            >
              <TrendingUp size={14} />
              <span className="text-xs">Nenhum modelo selecionado</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- Direita: Relógio / Data ---- */}
      <div className="flex flex-col items-end min-w-[200px]">
        <p className="text-white text-sm font-light tracking-widest tabular-nums">{time}</p>
        <div className="flex items-center gap-1 text-white/30">
          <Calendar size={9} />
          <p className="text-[10px]">{dateStr}</p>
        </div>
      </div>
    </div>
  );
}
