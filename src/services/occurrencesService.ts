import { supabase } from "@/integrations/supabase/client";
import type { Occurrence, CreateOccurrenceData, OccurrenceStats } from "@/types/occurrence";

/**
 * Service layer for Occurrence operations
 * Centralizes all Supabase database interactions
 */

/**
 * Creates a new occurrence in the database
 */
export async function createOccurrence(data: CreateOccurrenceData): Promise<{ data: Occurrence | null; error: Error | null }> {
  try {
    const { data: occurrence, error } = await supabase
      .from('occurrences')
      .insert({
        ...data,
        status: 'Recebida',
        prioridade: 'Média',
      })
      .select()
      .single();

    if (error) throw error;

    return { data: occurrence, error: null };
  } catch (error) {
    console.error('Error creating occurrence:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches all occurrences ordered by creation date (most recent first)
 */
export async function getOccurrences(limit?: number): Promise<{ data: Occurrence[]; error: Error | null }> {
  try {
    let query = supabase
      .from('occurrences')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching occurrences:', error);
    return { data: [], error: error as Error };
  }
}

/**
 * Fetches occurrences for the current authenticated user
 */
export async function getUserOccurrences(): Promise<{ data: Occurrence[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('occurrences')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching user occurrences:', error);
    return { data: [], error: error as Error };
  }
}

/**
 * Updates the status of an occurrence
 */
export async function updateOccurrenceStatus(
  id: string, 
  status: string
): Promise<{ data: Occurrence | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('occurrences')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating occurrence status:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Updates the priority of an occurrence
 */
export async function updateOccurrencePriority(
  id: string, 
  prioridade: string
): Promise<{ data: Occurrence | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('occurrences')
      .update({ prioridade })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating occurrence priority:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches statistics about occurrences
 */
export async function getOccurrenceStats(): Promise<{ data: OccurrenceStats | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Get total occurrences
    const { count: total, error: totalError } = await supabase
      .from('occurrences')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get user-specific occurrences if authenticated
    let userTotal = undefined;
    if (user) {
      const { count: userCount, error: userError } = await supabase
        .from('occurrences')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (userError) throw userError;
      userTotal = userCount || 0;
    }

    // Get pending occurrences
    const { count: pending, error: pendingError } = await supabase
      .from('occurrences')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Recebida', 'Em análise']);

    if (pendingError) throw pendingError;

    // Get completed occurrences
    const { count: completed, error: completedError } = await supabase
      .from('occurrences')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Concluída');

    if (completedError) throw completedError;

    return {
      data: {
        total: total || 0,
        userTotal,
        pending: pending || 0,
        completed: completed || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching occurrence stats:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Deletes an occurrence (admin only)
 */
export async function deleteOccurrence(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('occurrences')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting occurrence:', error);
    return { error: error as Error };
  }
}
