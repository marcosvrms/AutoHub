'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button, Input } from '@/src/components/ui/FormElements';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login({ email, password });
      success('Login realizado com sucesso!');
      router.push('/');
    } catch (err: any) {
      error(err.message || 'Credenciais inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <GlassPanel padding="p-8" className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta</h1>
          <p className="text-white/40 text-sm">Faça login para acessar sua conta no AutoHub</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          
          <Input
            label="Senha"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" isLoading={isLoading} className="mt-2" size="lg">
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/40">
          Não tem uma conta?{' '}
          <Link href="/auth/register" className="text-[#00D4FF] hover:underline">
            Cadastre-se
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
