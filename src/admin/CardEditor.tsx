import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  AdminCard,
  CardMode,
  MODE_LABELS,
  MODE_ORDER,
  MODE_STATUS,
  PROXIMITY_OPTIONS,
  getCardMode,
  normalizeContent,
  withMode,
} from './cardModel';
import { getCardPlacements, isPremiumOnly } from './stats';
import { useSaveCard } from './useAdminCards';
import { Button, Chip, FieldLabel, Segmented, Toggle, cx } from './ui';

const LEVELS = [0, 1, 2, 3, 4, 5].map(n => ({ value: n, label: String(n) }));

const CardEditor: React.FC<{
  card: AdminCard;
  isNew: boolean;
  allCards: AdminCard[];
  readOnly: boolean;
  onClose: () => void;
}> = ({ card, isNew, allCards, readOnly, onClose }) => {
  const [draft, setDraft] = useState<AdminCard>(card);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const save = useSaveCard();

  const mode = getCardMode(draft);
  const status = MODE_STATUS[mode];
  const dirty = JSON.stringify(draft) !== JSON.stringify(card);
  const placements = useMemo(() => getCardPlacements(draft), [draft]);
  const premiumOnly = isPremiumOnly(draft);

  // Jumelle ACTIVE au texte identique : le jeu n'en garde qu'une des deux.
  const duplicate = useMemo(() => {
    const key = normalizeContent(draft.content);
    if (!key || !draft.isActive) return undefined;
    return allCards.find(c => c.id !== draft.id && c.isActive && normalizeContent(c.content) === key);
  }, [allCards, draft.content, draft.id, draft.isActive]);

  const update = (patch: Partial<AdminCard>) => setDraft(d => ({ ...d, ...patch }));

  const requestClose = () => {
    if (dirty && !readOnly && !window.confirm('Quitter sans enregistrer les modifications ?')) return;
    onClose();
  };

  useEffect(() => {
    textRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  const insertPlaceholder = (token: string) => {
    const el = textRef.current;
    const start = el?.selectionStart ?? draft.content.length;
    const end = el?.selectionEnd ?? draft.content.length;
    const next = draft.content.slice(0, start) + token + draft.content.slice(end);
    update({ content: next });
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const handleSave = async () => {
    setError(null);
    if (!draft.content.trim()) {
      setError('Le texte de la carte est vide.');
      return;
    }
    try {
      await save.mutateAsync({ card: draft, isNew });
      toast.success(isNew ? 'Carte créée' : 'Carte enregistrée');
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible.');
    }
  };

  // Verdict global
  const plays = placements.filter(p => p.plays);
  let verdict: { tone: 'ok' | 'warn' | 'crit'; text: string };
  if (!draft.isActive) verdict = { tone: 'warn', text: 'Carte désactivée : elle ne sort nulle part.' };
  else if (mode === 'date') verdict = { tone: 'crit', text: "Le mode Date est retiré de l'app : cette carte ne sort nulle part." };
  else if (duplicate) verdict = { tone: 'warn', text: "Doublon : ce texte existe déjà sur une autre carte active. Le jeu n'en garde qu'une des deux." };
  else if (plays.length === 0) verdict = { tone: 'crit', text: 'Cette carte ne sortira dans aucune configuration.' };
  else if (!status.live) verdict = { tone: 'warn', text: `Mode pas encore en ligne : elle sortira quand « ${MODE_LABELS[mode]} » sera réactivé.` };
  else verdict = { tone: 'ok', text: `Cette carte sortira (${plays.length}/${placements.length} configurations).` };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <button type="button" aria-label="Fermer" onClick={requestClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative flex h-full w-full max-w-5xl flex-col border-l border-white/10 bg-[#0e0c11] shadow-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
          <div>
            <h2 id="editor-title" className="text-lg font-semibold text-white">
              {readOnly ? 'Carte' : isNew ? 'Nouvelle carte' : 'Modifier la carte'}
            </h2>
            {!isNew && <p className="font-mono text-[11px] text-zinc-600">{draft.id}</p>}
          </div>
          <Button variant="ghost" onClick={requestClose}>
            Fermer ✕
          </Button>
        </div>

        {/* Corps */}
        <div className="grid flex-1 gap-6 overflow-y-auto px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div>
              <FieldLabel htmlFor="card-content">Texte de la carte</FieldLabel>
              <textarea
                id="card-content"
                ref={textRef}
                value={draft.content}
                onChange={e => update({ content: e.target.value })}
                readOnly={readOnly}
                rows={5}
                placeholder="{player1}, raconte ta pire honte de soirée. Refus = 2 gorgées."
                className="w-full resize-y rounded-xl border border-white/10 bg-[#141217] px-4 py-3 text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span>Nommer un joueur :</span>
                {['{player1}', '{player2}', '{player3}'].map(token => (
                  <button
                    key={token}
                    type="button"
                    disabled={readOnly}
                    onClick={() => insertPlaceholder(token)}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-zinc-300 hover:bg-white/[0.09] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:opacity-50"
                  >
                    + {token}
                  </button>
                ))}
                <span className="ml-auto tabular-nums">{draft.content.length} caractères</span>
              </div>
            </div>

            <div>
              <FieldLabel>Mode</FieldLabel>
              <Segmented<CardMode>
                ariaLabel="Mode de la carte"
                value={mode}
                disabled={readOnly}
                onChange={m => setDraft(d => withMode(d, m))}
                options={MODE_ORDER.map(m => ({
                  value: m,
                  label: MODE_LABELS[m] + (MODE_STATUS[m].live ? '' : m === 'date' ? ' (retiré)' : ' (bientôt)'),
                  hint: MODE_STATUS[m].note,
                }))}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel>Accès</FieldLabel>
                <Segmented<string>
                  ariaLabel="Accès"
                  value={draft.isPremium ? 'premium' : 'free'}
                  disabled={readOnly}
                  onChange={v => update({ isPremium: v === 'premium' })}
                  options={[
                    { value: 'free', label: 'Gratuite' },
                    { value: 'premium', label: 'Premium' },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Proximité requise</FieldLabel>
                <Segmented<string>
                  ariaLabel="Proximité requise entre les joueurs"
                  value={draft.proximityLevel ?? 'none'}
                  disabled={readOnly}
                  onChange={v => update({ proximityLevel: v === 'none' ? undefined : (v as AdminCard['proximityLevel']) })}
                  options={PROXIMITY_OPTIONS.map(o => ({ value: o.value ?? 'none', label: o.label, hint: o.hint }))}
                />
                <p className="mt-2 text-xs text-zinc-500">
                  {PROXIMITY_OPTIONS.find(o => (o.value ?? null) === (draft.proximityLevel ?? null))?.hint}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel>Niveau d'alcool 🍺</FieldLabel>
                <Segmented<number>
                  ariaLabel="Niveau d'alcool"
                  value={draft.alcoholLevel ?? 0}
                  disabled={readOnly}
                  onChange={n => update({ alcoholLevel: n })}
                  options={LEVELS}
                />
              </div>
              <div>
                <FieldLabel>Niveau sexuel 🔥</FieldLabel>
                <Segmented<number>
                  ariaLabel="Niveau sexuel"
                  value={draft.sexualLevel ?? 0}
                  disabled={readOnly}
                  onChange={n => update({ sexualLevel: n })}
                  options={LEVELS}
                />
              </div>
            </div>
            <p className="-mt-3 text-xs text-zinc-500">Les niveaux 4 et 5 sont automatiquement réservés aux abonnés Premium.</p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-5">
              {mode === 'normal' && (
                <Toggle
                  checked={!!draft.isVote}
                  disabled={readOnly}
                  onChange={v => update({ isVote: v })}
                  label={
                    <span>
                      Carte de vote <span className="text-zinc-500">(groupes Premium avec l'option votes)</span>
                    </span>
                  }
                />
              )}
              <Toggle
                checked={draft.isActive}
                disabled={readOnly}
                onChange={v => update({ isActive: v })}
                label={draft.isActive ? 'Carte active' : 'Carte désactivée'}
              />
            </div>
          </div>

          {/* Aperçu : où sortira cette carte */}
          <aside className="space-y-4 lg:sticky lg:top-0 lg:self-start">
            <div
              className={cx(
                'rounded-2xl border p-4',
                verdict.tone === 'ok' && 'border-emerald-500/30 bg-emerald-500/[0.07]',
                verdict.tone === 'warn' && 'border-amber-500/30 bg-amber-500/[0.07]',
                verdict.tone === 'crit' && 'border-rose-500/30 bg-rose-500/[0.07]'
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Où cette carte sortira</p>
              <p
                className={cx(
                  'mt-2 text-sm font-semibold',
                  verdict.tone === 'ok' && 'text-emerald-300',
                  verdict.tone === 'warn' && 'text-amber-300',
                  verdict.tone === 'crit' && 'text-rose-300'
                )}
              >
                {verdict.tone === 'ok' ? '✅ ' : '⚠️ '}
                {verdict.text}
              </p>
            </div>

            {placements.length > 0 && (
              <ul className="space-y-2">
                {placements.map(p => (
                  <li key={p.config.id} className="rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-zinc-200">{p.config.label}</span>
                      <span className={cx('text-sm font-bold', p.plays ? 'text-emerald-300' : 'text-zinc-500')}>
                        {p.plays ? '✓' : '✗'}
                      </span>
                    </div>
                    {!p.plays && p.reason && <p className="mt-1 text-xs text-zinc-500">{p.reason}</p>}
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 text-xs">
              {premiumOnly && (
                <p className="flex items-start gap-2 text-pink-200/90">
                  <Chip tone="accent">Premium</Chip>
                  <span>{draft.isPremium ? 'Réservée aux abonnés.' : 'Réservée aux abonnés (intensité 4-5).'}</span>
                </p>
              )}
              {duplicate && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/[0.07] p-2.5 text-amber-200">
                  Jumelle : <span className="text-amber-100">« {duplicate.content.slice(0, 80)}{duplicate.content.length > 80 ? '…' : ''} »</span>{' '}
                  <span className="font-mono text-[10px] text-amber-300/70">({duplicate.id})</span>. Désactive l'une des deux.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Pied */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-7">
          <p className="text-sm text-rose-300" role="alert">
            {error}
            {readOnly && !error && <span className="text-zinc-500">Aperçu en lecture seule : connexion administrateur requise pour enregistrer.</span>}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={requestClose}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={readOnly || save.isPending || (!dirty && !isNew)}>
              {save.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
