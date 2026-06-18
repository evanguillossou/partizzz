
import { supabase } from '@/integrations/supabase/client';
import { cards } from '@/data/gameData';

export const migrateExistingCards = async () => {
  console.log('🚀 Début de la migration des cartes existantes...');

  try {
    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      console.log('✅ Les cartes ont déjà été migrées');
      return;
    }

    await seedAllCards();
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
};

// Upsert toutes les cartes depuis gameData (insert + ignore doublons)
export const seedAllCards = async () => {
  console.log('🔄 Synchronisation des cartes depuis gameData...');

  const cardsToUpsert = cards.map(card => ({
    id: card.id,
    content: card.content,
    alcohol_level: card.alcoholLevel ?? 0,
    sexual_level: card.sexualLevel ?? 0,
    is_deep: card.isDeep ?? false,
    is_vote: card.isVote ?? false,
    proximity_level: card.proximityLevel ?? null,
    date_mode: card.dateMode ?? null,
    explicitly_sexual: card.explicitlySexual ?? false,
    is_ref: card.isRef ?? false,
    is_premium: card.isPremium ?? false,
    is_interview: card.isInterview ?? false,
    is_active: true,
  }));

  const batchSize = 50;
  for (let i = 0; i < cardsToUpsert.length; i += batchSize) {
    const batch = cardsToUpsert.slice(i, i + batchSize);
    const { error } = await supabase
      .from('cards')
      .upsert(batch, { onConflict: 'id', ignoreDuplicates: true });

    if (error) {
      console.error('❌ Erreur lot:', JSON.stringify(error));
      throw error;
    }

    console.log(`✅ Lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(cardsToUpsert.length / batchSize)} sync`);
  }

  console.log(`🎉 Sync terminée — ${cardsToUpsert.length} cartes traitées`);
};
