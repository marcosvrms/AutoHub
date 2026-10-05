'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button, Input, Select } from '@/src/components/ui/FormElements';
import { authService } from '@/src/services/auth.service';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';
import type { AccountType } from '@/src/types';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'INDIVIDUAL' as AccountType,
    document: '',
    phone: '',
    birthDate: '',
    foundationDate: '',
    city: '',
    state: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isIndividual = formData.accountType === 'INDIVIDUAL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 12) {
      error('A senha deve ter pelo menos 12 caracteres.');
      return;
    }

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
        accountType: formData.accountType,
        document: formData.document,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        ...(isIndividual
          ? { birthDate: formData.birthDate }
          : { foundationDate: formData.foundationDate }),
      });
      
      // Auto login após cadastro
      await login({ email: formData.email, password: formData.password });
      
      success('Conta criada com sucesso!');
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.';
      error(msg);
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
            <Select
              label="Tipo de Conta"
              value={formData.accountType}
              onChange={(e) => setFormData(p => ({ ...p, accountType: e.target.value as AccountType }))}
              options={[
                { value: 'INDIVIDUAL', label: 'Pessoa Física' },
                { value: 'DEALERSHIP', label: 'Concessionária' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label={isIndividual ? 'CPF' : 'CNPJ'}
              placeholder={isIndividual ? '000.000.000-00' : '00.000.000/0000-00'}
              required
              value={formData.document}
              onChange={(e) => setFormData(p => ({ ...p, document: e.target.value }))}
            />
            <Input
              label="Telefone"
              placeholder="(49) 99999-9999"
              required
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Senha (mín. 12 caracteres)"
              type="password"
              required
              minLength={12}
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

          {/* Data de nascimento ou fundação conforme tipo de conta */}
          <Input
            label={isIndividual ? 'Data de Nascimento' : 'Data de Fundação'}
            type="date"
            required
            value={isIndividual ? formData.birthDate : formData.foundationDate}
            onChange={(e) =>
              setFormData(p => (isIndividual
                ? { ...p, birthDate: e.target.value }
                : { ...p, foundationDate: e.target.value }
              ))
            }
          />

          <div className="grid grid-cols-2 gap-5">
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
              placeholder="SC"
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
