import React, { useMemo } from 'react';
import { explainPlayerCountUnsuitability } from '@/utils/cardSelectionUtils';
import { AdminCard, CardMode, MODE_LABELS, MODE_ORDER, MODE_STATUS, getCardMode, normalizeContent } from './cardModel';
import { findInvisibleCardIds, isPremiumOnly } from './stats';
import { Button, Chip, cx } from './ui';

export interface ListFilters {
  query: string;
  mode: CardMode | 'all';
  access: 'all' | 'free' | 'premium';
  status: 'active' | 'inactive' | 'all';
  visibility: 'all' | 'invisible' | 'not-2p' | 'waiting';
}

export const DEFAULT_FILTERS: ListFilters = {
  query: '',
  mode: 'all',
  access: 'all',
  status: 'active',
  visibility: 'all',
};

const selectClass =
  'rounded-lg border border-white/10 bg-[#141217] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400';

const FilterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <label className="flex flex-col gap-1">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
    <select className={selectClass} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

const AdminCardList: React.FC<{
  cards: AdminCard[];
  filters: ListFilters;
  onFiltersChange: (filters: ListFilters) => void;
  onEdit: (card: AdminCard) => void;
  onCreate: () => void;
  readOnly: boolean;
}> = ({ cards, filters, onFiltersChange, onEdit, onCreate, readOnly }) => {
  const invisibleIds = useMemo(() => findInvisibleCardIds(cards), [cards]);
  // Textes présents plusieurs fois parmi les cartes actives (le jeu n'en garde qu'un)
  const duplicateKeys = useMemo(() => {
    const counts = new Map<string, number>();
    cards.filter(c => c.isActive).forEach(c => {
      const key = normalizeContent(c.content);
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return new Set([...counts].filter(([, n]) => n > 1).map(([key]) => key));
  }, [cards]);
  const set = (patch: Partial<ListFilters>) => onFiltersChange({ ...filters, ...patch });

  const rows = useMemo(() => {
    const query = normalizeContent(filters.query);
    return cards.filter(card => {
      const mode = getCardMode(card);
      if (filters.status === 'active' && !card.isActive) return false;
      if (filters.status === 'inactive' && card.isActive) return false;
      if (filters.mode !== 'all' && mode !== filters.mode) return false;
      if (filters.access === 'premium' && !isPremiumOnly(card)) return false;
      if (filters.access === 'free' && isPremiumOnly(card)) return false;
      if (filters.visibility === 'invisible' && !invisibleIds.has(card.id)) return false;
      if (filters.visibility === 'waiting' && MODE_STATUS[mode].live) return false;
      if (filters.visibility === 'not-2p' && !explainPlayerCountUnsuitability(card, 2)) return false;
      if (query && !normalizeContent(card.content).includes(query)) return false;
      return true;
    });
  }, [cards, filters, invisibleIds]);

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Rechercher</span>
            <input
              type="search"
              value={filters.query}
              onChange={e => set({ query: e.target.value })}
              placeholder="Un mot de la carte…"
              className="rounded-lg border border-white/10 bg-[#141217] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            />
          </label>
          <FilterSelect
            label="Mode"
            value={filters.mode}
            onChange={v => set({ mode: v as ListFilters['mode'] })}
            options={[{ value: 'all', label: 'Tous les modes' }, ...MODE_ORDER.map(m => ({ value: m, label: MODE_LABELS[m] }))]}
          />
          <FilterSelect
            label="Accès"
            value={filters.access}
            onChange={v => set({ access: v as ListFilters['access'] })}
            options={[
              { value: 'all', label: 'Gratuites + Premium' },
              { value: 'free', label: 'Gratuites' },
              { value: 'premium', label: 'Premium' },
            ]}
          />
          <FilterSelect
            label="État"
            value={filters.status}
            onChange={v => set({ status: v as ListFilters['status'] })}
            options={[
              { value: 'active', label: 'Actives' },
              { value: 'inactive', label: 'Désactivées' },
              { value: 'all', label: 'Toutes' },
            ]}
          />
          <FilterSelect
            label="Diagnostic"
            value={filters.visibility}
            onChange={v => set({ visibility: v as ListFilters['visibility'] })}
            options={[
              { value: 'all', label: 'Toutes' },
              { value: 'invisible', label: 'Invisibles (ne sortent jamais)' },
              { value: 'not-2p', label: 'Ne marchent pas à 2 joueurs' },
              { value: 'waiting', label: 'Dans un mode pas en ligne' },
            ]}
          />
          <Button variant="primary" onClick={onCreate} disabled={readOnly} title={readOnly ? 'Aperçu en lecture seule' : undefined}>
            + Nouvelle carte
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
          <span>
            <b className="tabular-nums text-zinc-300">{rows.length}</b> carte{rows.length > 1 ? 's' : ''}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={() => onFiltersChange(DEFAULT_FILTERS)}
              className="rounded font-semibold text-pink-300 hover:text-pink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-zinc-500">Aucune carte ne correspond à ces filtres.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.map(card => {
              const mode = getCardMode(card);
              const live = MODE_STATUS[mode].live;
              const ok2 = !explainPlayerCountUnsuitability(card, 2);
              const okGroup = !explainPlayerCountUnsuitability(card, 4);
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => onEdit(card)}
                    className={cx(
                      'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:bg-white/[0.06]',
                      !card.isActive && 'opacity-50'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm text-zinc-100">{card.content || <i className="text-zinc-500">(vide)</i>}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip tone={live ? 'neutral' : 'muted'}>{MODE_LABELS[mode]}</Chip>
                        {isPremiumOnly(card) && <Chip tone="accent">Premium</Chip>}
                        <Chip tone="neutral" title="Alcool · Sexe">
                          🍺 {card.alcoholLevel ?? 0} · 🔥 {card.sexualLevel ?? 0}
                        </Chip>
                        <Chip tone={ok2 ? 'ok' : 'muted'}>2 joueurs {ok2 ? '✓' : '✗'}</Chip>
                        <Chip tone={okGroup ? 'ok' : 'muted'}>Groupe {okGroup ? '✓' : '✗'}</Chip>
                        {card.isVote && <Chip tone="neutral">Vote</Chip>}
                        {invisibleIds.has(card.id) && <Chip tone="crit">Invisible</Chip>}
                        {card.isActive && duplicateKeys.has(normalizeContent(card.content)) && (
                          <Chip tone="warn" title="Le même texte existe sur une autre carte active : le jeu n'en garde qu'une">
                            Doublon
                          </Chip>
                        )}
                        {!card.isActive && <Chip tone="muted">Désactivée</Chip>}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500">{readOnly ? 'Voir' : 'Modifier'} →</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCardList;
