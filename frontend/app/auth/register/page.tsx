'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button, Input } from '@/src/components/ui/FormElements';
import { authService } from '@/src/services/auth.service';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpfCnpj: '',
    phone: '',
    city: '',
    state: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      error('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpfCnpj: formData.cpfCnpj,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
      });
      
      // Auto login após cadastro
      await login({ email: formData.email, password: formData.password });
      
      success('Conta criada com sucesso!');
      router.push('/');
    } catch (err: any) {
      error(err.message || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 py-12">
      <GlassPanel padding="p-8" className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
          <p className="text-white/40 text-sm">Junte-se à maior plataforma de veículos</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nome Completo"
            required
            value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
          />
          
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="CPF ou CNPJ"
              required
              value={formData.cpfCnpj}
              onChange={(e) => setFormData(p => ({ ...p, cpfCnpj: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Senha"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <Input
              label="Telefone"
              required
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label="Cidade"
              required
              value={formData.city}
              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
            />
            <Input
              label="Estado (UF)"
              required
              maxLength={2}
              value={formData.state}
              onChange={(e) => setFormData(p => ({ ...p, state: e.target.value.toUpperCase() }))}
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-4" size="lg">
            Criar Conta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/40">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-[#00D4FF] hover:underline">
            Faça login
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
