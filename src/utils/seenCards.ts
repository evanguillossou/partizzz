/**
 * seenCards.ts — Mémoire des cartes déjà jouées, sur l'appareil.
 *
 * Objectif : qu'aucune carte ne revienne avant que tout le stock disponible
 * ait été joué. Les cartes jamais vues passent en premier ; quand il n'en reste
 * plus, les plus anciennement vues reviennent d'abord (cycle naturel).
 *
 * Stockage : localStorage (par appareil, aucune donnée envoyée). Toujours dans
 * un try/catch : navigation privée ou stockage bloqué = jeu normal sans mémoire.
 */

const STORAGE_KEY = 'partiz_seen_cards_v1';
// Garde-fou de taille : au-delà, on oublie les cartes vues il y a le plus longtemps.
const MAX_ENTRIES = 3000;

/** Carte id → horodatage de la dernière fois où elle a été montrée. */
export const loadSeenCards = (): Map<string, number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries: [string, number][] = raw ? JSON.parse(raw) : [];
    return new Map(entries);
  } catch {
    return new Map();
  }
};

/** Enregistre qu'une carte vient d'être montrée. */
export const markCardSeen = (cardId: string | undefined): void => {
  if (!cardId) return;
  try {
    const seen = loadSeenCards();
    seen.delete(cardId); // la remet en fin de liste (= la plus récente)
    seen.set(cardId, Date.now());
    let entries = [...seen.entries()];
    if (entries.length > MAX_ENTRIES) entries = entries.slice(entries.length - MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* stockage indisponible : on joue sans mémoire */
  }
};
