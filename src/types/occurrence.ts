import type { Json } from "@/integrations/supabase/types";

// Types for Occurrence data
export interface Occurrence {
  id: string;
  categoria: string;
  status: string;
  prioridade: string;
  nome: string;
  telefone: string;
  endereco: string;
  ponto_referencia?: string | null;
  descricao: string;
  fotos?: string[] | null;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  acessibilidade_afetada?: boolean | null;
  publica?: boolean | null;
  historico?: Json | null;
}

export interface CreateOccurrenceData {
  categoria: string;
  endereco: string;
  descricao: string;
  nome: string;
  telefone: string;
  ponto_referencia?: string;
  fotos?: string[];
  acessibilidade_afetada?: boolean;
  publica?: boolean;
  user_id?: string;
}

export interface OccurrenceStats {
  total: number;
  userTotal?: number;
  pending: number;
  completed: number;
}
