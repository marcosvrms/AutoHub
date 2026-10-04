// ============================================================
// AUTOHUB — UTILITIES
// ============================================================

/**
 * Formata um número como moeda brasileira (BRL)
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Formata data ISO em pt-BR
 */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Retorna iniciais de um nome
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Retorna label amigável para ListingStatus
 */
export function formatListingStatus(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Rascunho',
    PUBLISHED: 'Publicado',
    SOLD: 'Vendido',
    INACTIVE: 'Inativo',
  };
  return map[status] ?? status;
}

/**
 * Traduz AttributeType para label humano
 */
export function formatAttributeType(type: string): string {
  const map: Record<string, string> = {
    BOOLEAN: 'Sim/Não',
    INTEGER: 'Número inteiro',
    DECIMAL: 'Decimal',
    TEXT: 'Texto',
    SELECT: 'Seleção única',
    MULTI_SELECT: 'Seleção múltipla',
  };
  return map[type] ?? type;
}

/**
 * Trunca texto longo
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 3)}...`;
}

/**
 * Normaliza mensagens de erro da API para exibição
 */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Ocorreu um erro inesperado.';
}

/**
 * Gera hora atual formatada HH:MM
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
