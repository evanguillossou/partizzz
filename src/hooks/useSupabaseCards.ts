
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/types/game';
import { cards as localCards } from '@/data/gameData';

// Cartes actives du jeu (lecture seule). Les créations / modifications de
// cartes se font dans le back-office (/admin), réservé à l'administrateur.
export const useCards = () => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase inaccessible, fallback local');
        return localCards;
      }

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
        isRef: card.is_ref || false,
        isPremium: card.is_premium || false,
        isInterview: card.is_interview || false,
      })) as Card[];
    }
  });
};
