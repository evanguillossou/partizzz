import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminCard, cardToRow, rowToCard } from './cardModel';

const QUERY_KEY = ['admin-cards'];

/**
 * Toutes les cartes, actives ET désactivées. Les cartes désactivées ne sont
 * visibles qu'avec un compte administrateur (règles de sécurité Supabase).
 */
export const useAdminCards = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<AdminCard[]> => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(explainSupabaseError(error));
      return (data ?? []).map(rowToCard);
    },
  });

/** Traduit les erreurs Supabase en message compréhensible. */
export const explainSupabaseError = (error: { code?: string; message?: string }): string => {
  const msg = error?.message || '';
  if (error?.code === '42501' || /row-level security/i.test(msg) || error?.code === 'PGRST116') {
    return "Refusé : ce compte n'a pas les droits d'administrateur sur les cartes.";
  }
  if (/duplicate key/i.test(msg)) return 'Une carte avec cet identifiant existe déjà.';
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Connexion à la base impossible. Vérifie ta connexion internet.';
  return msg || 'Erreur inconnue.';
};

export const useSaveCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ card, isNew }: { card: AdminCard; isNew: boolean }) => {
      const row = cardToRow(card);
      if (isNew) {
        const { error } = await supabase.from('cards').insert(row).select('id').single();
        if (error) throw new Error(explainSupabaseError(error));
      } else {
        const { id, ...changes } = row;
        // .single() échoue si aucune ligne n'a été modifiée (= écriture refusée)
        const { error } = await supabase.from('cards').update(changes).eq('id', id).select('id').single();
        if (error) throw new Error(explainSupabaseError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cards'] }); // cartes du jeu
    },
  });
};
