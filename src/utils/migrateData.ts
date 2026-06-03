
import { supabase } from '@/integrations/supabase/client';
import { cards } from '@/data/gameData';

export const migrateExistingCards = async () => {
  console.log('🚀 Début de la migration des cartes existantes...');
  
  try {
    // Vérifier si les cartes ont déjà été migrées
    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log('✅ Les cartes ont déjà été migrées');
      return;
    }
    
    // Transformer les cartes du format local vers le format Supabase
    const cardsToInsert = cards.map(card => ({
      id: card.id,
      content: card.content,
      alcohol_level: card.alcoholLevel || 0,
      sexual_level: card.sexualLevel || 0,
      is_deep: card.isDeep || false,
      is_vote: card.isVote || false,
      proximity_level: card.proximityLevel || null,
      date_mode: card.dateMode || null,
      explicitly_sexual: card.explicitlySexual || false,
      is_active: true
    }));
    
    // Insérer les cartes par lots de 50
    const batchSize = 50;
    for (let i = 0; i < cardsToInsert.length; i += batchSize) {
      const batch = cardsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('cards')
        .insert(batch);
      
      if (error) {
        console.error('❌ Erreur lors de l\'insertion du lot:', error);
        throw error;
      }
      
      console.log(`✅ Lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(cardsToInsert.length / batchSize)} migré`);
    }
    
    console.log(`🎉 Migration terminée ! ${cardsToInsert.length} cartes migrées avec succès`);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
};
