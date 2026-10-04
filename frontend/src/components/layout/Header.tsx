'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Search,
  User,
  Heart,
  ChevronDown,
  LogOut,
  Settings,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';

const NAV_LINKS = [
  { label: 'Marcas', href: '/brands' },
  { label: 'Comprar', href: '/listings' },
  { label: 'Vender', href: '/sell' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fechar user menu ao clicar fora
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-[rgba(6,10,24,0.90)] backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center gap-8">

        {/* ---- Logo ---- */}
        <Link href="/" aria-label="AutoHub — Página Inicial" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B500FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Zap size={14} fill="white" className="text-white" />
          </div>
          <span className="text-white font-bold tracking-[0.15em] text-lg">
            AUTO<span className="text-[#00D4FF]">HUB</span>
          </span>
        </Link>

        {/* ---- Nav Central ---- */}
        <nav
          aria-label="Navegação principal"
          className="flex-1 flex items-center justify-center gap-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-5 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
                  ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}
                `}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#00D4FF]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ---- Ações Direita ---- */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <Link
            href="/search"
            aria-label="Buscar veículos"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/6 transition-all"
          >
            <Search size={17} />
          </Link>

          {/* Favoritos — preparado para futura integração */}
          <button
            aria-label="Meus favoritos (em breve)"
            title="Favoritos — em breve"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/6 transition-all"
          >
            <Heart size={17} />
          </button>

          {/* Usuário */}
          {isAuthenticated ? (
            <div className="relative" data-user-menu>
              <button
                id="user-menu-button"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 h-9 pl-2 pr-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
              >
                {/* Avatar */}
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B500FF] flex items-center justify-center text-[10px] font-bold text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-white/70 max-w-[100px] truncate">
                  {user?.name.split(' ')[0]}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-white/30 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-[rgba(10,15,30,0.97)] backdrop-blur-xl shadow-2xl overflow-hidden"
                    role="menu"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-white/40 text-xs truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <UserMenuItem href="/profile" icon={<User size={14} />} label="Meu Perfil" onClick={() => setUserMenuOpen(false)} />
                      <UserMenuItem href="/my-listings" icon={<ClipboardList size={14} />} label="Meus Anúncios" onClick={() => setUserMenuOpen(false)} />
                      {isAdmin && (
                        <UserMenuItem href="/admin" icon={<LayoutDashboard size={14} />} label="Administração" onClick={() => setUserMenuOpen(false)} />
                      )}
                      <UserMenuItem href="/settings" icon={<Settings size={14} />} label="Configurações" onClick={() => setUserMenuOpen(false)} />
                    </div>
                    <div className="border-t border-white/8 py-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        role="menuitem"
                      >
                        <LogOut size={14} />
                        Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="h-9 px-4 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/6 border border-white/10 hover:border-white/20 transition-all font-medium"
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="h-9 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-[#060A18] hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,212,255,0.25)]"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ---- Helper ----
function UserMenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
    >
      <span className="text-white/30">{icon}</span>
      {label}
    </Link>
  );
}
