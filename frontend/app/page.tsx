'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  Car,
  Ship,
  Plane,
  ShieldCheck,
  Users,
  ArrowRight,
  TrendingUp,
  Globe,
  Search,
} from 'lucide-react';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button } from '@/src/components/ui/FormElements';
import { useAuth } from '@/src/contexts/AuthContext';
import { Footer } from '@/src/components/layout/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] },
  }),
};

const CATEGORIES = [
  {
    icon: <Car size={28} />,
    label: 'Terrestre',
    description: 'Carros, motos, caminhões, ônibus e muito mais.',
    color: '#00D4FF',
  },
  {
    icon: <Ship size={28} />,
    label: 'Aquático',
    description: 'Lanchas, jet skis, barcos e embarcações.',
    color: '#00D4FF',
  },
  {
    icon: <Plane size={28} />,
    label: 'Aéreo',
    description: 'Aviões, helicópteros e aeronaves em geral.',
    color: '#B500FF',
  },
];

const FEATURES = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Segurança',
    description: 'Transações protegidas com carteira digital integrada e verificação de vendedores.',
  },
  {
    icon: <Search size={22} />,
    title: 'Busca Inteligente',
    description: 'Encontre o veículo ideal com filtros avançados por marca, modelo, ano e preço.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Marketplace',
    description: 'Publique anúncios, receba propostas e gerencie suas vendas de forma simples.',
  },
  {
    icon: <Globe size={22} />,
    title: 'Catálogo Global',
    description: 'Explore um catálogo de veículos de diversas categorias, marcas e fabricantes.',
  },
  {
    icon: <Users size={22} />,
    title: 'Comunidade',
    description: 'Conecte-se com compradores e vendedores verificados em todo o Brasil.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Performance',
    description: 'Plataforma moderna e rápida construída com as melhores tecnologias.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-x-hidden">
      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-8 py-20">
        {/* Glow decorativo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, rgba(181,0,255,0.10) 40%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-3xl text-center flex flex-col items-center gap-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/5 text-[#00D4FF] text-xs font-semibold tracking-wide">
              <Zap size={12} fill="currentColor" />
              Plataforma AutoHub
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight"
          >
            Bem-vindo ao{' '}
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#B500FF] bg-clip-text text-transparent">
              AutoHub
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed"
          >
            O seu hub definitivo para veículos. Descubra, compare, compre e venda
            veículos terrestres, aquáticos e aéreos em uma única plataforma.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/catalog">
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Explorar Catálogo
              </Button>
            </Link>
            <Link href="/listings">
              <Button variant="secondary" size="lg">
                Ver Anúncios
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/auth/register">
                <Button variant="neon" size="lg">
                  Criar Conta Grátis
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══════════ O QUE É O AUTOHUB ══════════ */}
      <section className="px-8 py-20 max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="text-[#00D4FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4"
          >
            Sobre a Plataforma
          </motion.p>
          <motion.h2
            custom={1}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            O que é o AutoHub?
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-white/45 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            O AutoHub é uma plataforma completa de marketplace de veículos que conecta
            compradores e vendedores. Com um catálogo organizado por categorias, marcas e modelos,
            você pode explorar veículos de todos os tipos — desde carros e motos até lanchas e aviões.
          </motion.p>
        </motion.div>

        {/* Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
            >
              <GlassPanel hover padding="p-8" className="text-center h-full flex flex-col items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)`,
                    border: `1px solid ${cat.color}25`,
                  }}
                >
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold">{cat.label}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{cat.description}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ FUNCIONALIDADES ══════════ */}
      <section className="px-8 py-20 max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="text-[#B500FF] text-xs font-semibold uppercase tracking-[0.3em] mb-4"
          >
            Funcionalidades
          </motion.p>
          <motion.h2
            custom={1}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Tudo o que você precisa
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-white/45 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Do catálogo de veículos ao marketplace, o AutoHub reúne ferramentas poderosas para
            compradores e vendedores.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
            >
              <GlassPanel hover padding="p-6" className="h-full">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/15 flex items-center justify-center text-[#00D4FF] mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feat.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feat.description}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="px-8 py-20 max-w-[1000px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <GlassPanel
              neon="blue"
              padding="p-12"
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-white/45 text-lg mb-8 max-w-lg mx-auto">
                Crie sua conta gratuitamente e comece a explorar o maior hub de veículos do Brasil.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/catalog">
                  <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                    Ver Catálogo
                  </Button>
                </Link>
                <Link href="/listings">
                  <Button variant="secondary" size="lg">
                    Explorar Marketplace
                  </Button>
                </Link>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
