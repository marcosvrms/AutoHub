'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/6">
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#B500FF] flex items-center justify-center">
                <Zap size={14} fill="white" className="text-white" />
              </div>
              <span className="text-white font-bold tracking-[0.15em]">
                AUTO<span className="text-[#00D4FF]">HUB</span>
              </span>
            </Link>
            <p className="text-white/30 text-xs leading-relaxed max-w-[180px]">
              O hub definitivo para veículos de todos os tipos.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Plataforma</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/listings" label="Comprar" />
              <FooterLink href="/sell" label="Vender" />
              <FooterLink href="/brands" label="Fabricantes" />
              <FooterLink href="/search" label="Buscar" />
            </div>
          </div>

          {/* Categorias */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Categorias</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/listings?category=terrestre" label="Terrestre" />
              <FooterLink href="/listings?category=aereo" label="Aéreo" />
              <FooterLink href="/listings?category=aquatico" label="Aquático" />
            </div>
          </div>

          {/* Sobre */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Sobre</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/about" label="Sobre o AutoHub" />
              <FooterLink href="/terms" label="Termos de Uso" />
              <FooterLink href="/privacy" label="Privacidade" />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/6 flex items-center justify-between">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} AutoHub. Todos os direitos reservados.
          </p>
          <p className="text-white/20 text-xs">
            Plataforma global de veículos.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-white/35 hover:text-[#00D4FF] transition-colors duration-200"
    >
      {label}
    </Link>
  );
}
