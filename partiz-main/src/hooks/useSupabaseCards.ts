
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/types/game';

// Hook pour récupérer toutes les cartes
export const useCards = () => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(card => ({
        id: card.id,
        content: card.content,
        alcoholLevel: card.alcohol_level || 0,
        sexualLevel: card.sexual_level || 0,
        isDeep: card.is_deep || false,
        isVote: card.is_vote || false,
        proximityLevel: card.proximity_level as 'stranger' | 'friend' | 'close' | undefined,
        dateMode: card.date_mode as 'no' | 'compatible' | 'exclusive' | undefined,
        explicitlySexual: card.explicitly_sexual || false,
        isRef: card.is_ref || false
      })) as Card[];
    }
  });
};

// Hook pour ajouter une carte
export const useAddCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (card: Omit<Card, 'id'>) => {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: card.content,
          alcohol_level: card.alcoholLevel || 0,
          sexual_level: card.sexualLevel || 0,
          is_deep: card.isDeep || false,
          is_vote: card.isVote || false,
          proximity_level: card.proximityLevel || null,
          date_mode: card.dateMode || null,
          explicitly_sexual: card.explicitlySexual || false,
          is_ref: card.isRef || false
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    }
  });
};

// Hook pour modifier une carte
export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...card }: Card) => {
      const { data, error } = await supabase
        .from('cards')
        .update({
          content: card.content,
          alcohol_level: card.alcoholLevel || 0,
          sexual_level: card.sexualLevel || 0,
          is_deep: card.isDeep || false,
          is_vote: card.isVote || false,
          proximity_level: card.proximityLevel || null,
          date_mode: card.dateMode || null,
          explicitly_sexual: card.explicitlySexual || false,
          is_ref: card.isRef || false
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    }
  });
};

// Hook pour supprimer une carte (soft delete)
export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase
        .from('cards')
        .update({ is_active: false })
        .eq('id', cardId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    }
  });
};
