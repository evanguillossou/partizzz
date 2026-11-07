import React, { useMemo } from 'react';
import { AdminCard, CardMode, MODE_LABELS, MODE_ORDER, MODE_STATUS, getCardMode } from './cardModel';
import {
  PoolResult,
  TARGET_GAMES,
  computeAllPools,
  computeProductionGoals,
  countByMode,
  findInvisibleCardIds,
  isPremiumOnly,
} from './stats';
import { Button, Chip, Panel, SectionTitle, cx, formatNumber } from './ui';
import type { ListFilters } from './AdminCardList';

const modeChip = (mode: CardMode) => {
  const status = MODE_STATUS[mode];
  if (status.live) return <Chip tone="ok">En ligne</Chip>;
  if (mode === 'date') return <Chip tone="muted">Retiré</Chip>;
  return <Chip tone="warn">En attente</Chip>;
};

const Kpi: React.FC<{ label: string; value: React.ReactNode; hint?: string; tone?: 'default' | 'accent' | 'warn' }> = ({
  label,
  value,
  hint,
  tone = 'default',
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
    <p
      className={cx(
        'mt-2 text-3xl font-bold tabular-nums tracking-tight',
        tone === 'accent' && 'text-pink-300',
        tone === 'warn' && 'text-amber-300',
        tone === 'default' && 'text-white'
      )}
    >
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
  </div>
);

/** Barre de progression avec repère du palier 1 (4 parties) vers le palier 2 (6 parties). */
const PoolBar: React.FC<{ pool: PoolResult }> = ({ pool }) => {
  const pct = Math.min(1, pool.size / pool.target2) * 100;
  const marker = (TARGET_GAMES.level1 / TARGET_GAMES.level2) * 100;
  const fill =
    pool.level === 'level2' ? 'bg-emerald-400' : pool.level === 'level1' ? 'bg-emerald-500/80' : 'bg-amber-400';
  return (
    <div className="relative h-2 w-full overflow-visible rounded-full bg-white/10">
      <div className={cx('h-2 rounded-full transition-all', pool.live ? fill : 'bg-zinc-500')} style={{ width: `${pct}%` }} />
      <div
        className="absolute -top-1 h-4 w-px bg-white/50"
        style={{ left: `${marker}%` }}
        title={`Palier 1 : ${pool.target1} cartes`}
      />
    </div>
  );
};

const PoolRow: React.FC<{ pool: PoolResult }> = ({ pool }) => {
  const games = pool.size / pool.perGame;
  const missing1 = Math.max(0, pool.target1 - pool.size);
  return (
    <div className={cx('grid gap-2 py-3.5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_9.5rem] sm:items-center sm:gap-5', !pool.live && 'opacity-60')}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-100">{pool.config.label}</p>
        <p className="text-xs text-zinc-500">
          {pool.config.detail} · {pool.perGame} cartes par partie
        </p>
      </div>
      <div className="min-w-0">
        <PoolBar pool={pool} />
        <p className="mt-1.5 text-xs text-zinc-400">
          <span className="font-semibold tabular-nums text-zinc-200">{pool.size}</span> cartes jouables ·{' '}
          <span className="tabular-nums">≈ {formatNumber(games)}</span> parties sans répétition
          {pool.config.premium && (
            <>
              {' '}· dont <span className="tabular-nums text-pink-300">{pool.exclusive}</span> réservées Premium
            </>
          )}
        </p>
      </div>
      <div className="sm:text-right">
        {pool.level === 'level2' ? (
          <Chip tone="ok">✓ Confortable</Chip>
        ) : pool.level === 'level1' ? (
          <Chip tone="ok">✓ Palier 1 atteint</Chip>
        ) : (
          <Chip tone={pool.live ? 'warn' : 'muted'}>Manque {missing1}</Chip>
        )}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ cards: AdminCard[]; onOpenList: (filters: Partial<ListFilters>) => void }> = ({
  cards,
  onOpenList,
}) => {
  const counts = useMemo(() => countByMode(cards), [cards]);
  const pools = useMemo(() => computeAllPools(cards), [cards]);
  const goals = useMemo(() => computeProductionGoals(pools), [pools]);
  const invisibleIds = useMemo(() => findInvisibleCardIds(cards), [cards]);

  const active = cards.filter(c => c.isActive);
  const premiumLive = active.filter(c => isPremiumOnly(c) && MODE_STATUS[getCardMode(c)].live).length;
  const premiumWaiting = active.filter(c => isPremiumOnly(c) && !MODE_STATUS[getCardMode(c)].live).length;
  const toWrite = goals.reduce((sum, g) => sum + g.missing, 0);

  return (
    <div className="space-y-6">
      {/* Chiffres clés */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Cartes actives" value={active.length} hint={`${cards.length - active.length} désactivées`} />
        <Kpi label="Premium en ligne" value={premiumLive} hint="cartes réservées aux abonnés, jouables aujourd'hui" tone="accent" />
        <Kpi label="À écrire · palier 1" value={toWrite} hint="tous modes confondus (détail ci-dessous)" />
        <Kpi
          label="Cartes invisibles"
          value={invisibleIds.size}
          hint="actives mais ne sortent jamais"
          tone={invisibleIds.size > 0 ? 'warn' : 'default'}
        />
      </div>

      {/* Objectifs de production */}
      <Panel>
        <SectionTitle
          title="Objectifs de production"
          subtitle={
            <>
              Cartes à écrire pour atteindre le <b className="text-zinc-200">palier 1</b> : {TARGET_GAMES.level1} parties
              d'affilée sans revoir une carte. Une carte qui marche à 2 joueurs compte aussi pour les groupes : écris-les
              comme ça en priorité.
            </>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {goals.map(goal => (
            <div
              key={goal.key}
              className={cx(
                'rounded-xl border p-4',
                goal.missing === 0 ? 'border-emerald-500/30 bg-emerald-500/[0.06]' : 'border-white/10 bg-white/[0.02]'
              )}
            >
              <p className="text-sm font-medium text-zinc-100">{goal.label}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-white">
                {goal.missing === 0 ? '✓' : `+${goal.missing}`}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{goal.missing === 0 ? 'Palier 1 atteint' : goal.hint}</p>
              {!goal.live && <p className="mt-2 text-[11px] font-semibold text-amber-300/90">Mode à réactiver</p>}
            </div>
          ))}
        </div>
      </Panel>

      {/* Ce que les joueurs voient vraiment */}
      <Panel>
        <SectionTitle
          title="Ce que les joueurs voient vraiment"
          subtitle={
            <>
              Calculé avec l'algorithme du jeu. La barre se remplit jusqu'au palier 2 ({TARGET_GAMES.level2} parties) ; le
              trait blanc marque le palier 1.
            </>
          }
        />
        <div className="space-y-6">
          {MODE_ORDER.filter(mode => pools.some(p => p.config.mode === mode)).map(mode => (
            <div key={mode}>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{MODE_LABELS[mode]}</h3>
                {modeChip(mode)}
              </div>
              <div className="divide-y divide-white/5">
                {pools
                  .filter(p => p.config.mode === mode)
                  .map(pool => (
                    <PoolRow key={pool.config.id} pool={pool} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Cartes par mode */}
      <Panel>
        <SectionTitle
          title="Cartes par mode"
          subtitle="« Premium » = cartes marquées Premium + cartes d'intensité 4-5 (réservées aux abonnés)."
        />
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-2 pb-3 font-semibold">Mode</th>
                <th className="px-2 pb-3 font-semibold">Statut</th>
                <th className="px-2 pb-3 text-right font-semibold">Gratuites</th>
                <th className="px-2 pb-3 text-right font-semibold">Premium</th>
                <th className="px-2 pb-3 text-right font-semibold">Total actives</th>
                <th className="px-2 pb-3 text-right font-semibold">Désactivées</th>
                <th className="px-2 pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {counts.map(row => (
                <tr key={row.mode}>
                  <td className="px-2 py-3 font-medium text-zinc-100">{MODE_LABELS[row.mode]}</td>
                  <td className="px-2 py-3">{modeChip(row.mode)}</td>
                  <td className="px-2 py-3 text-right tabular-nums text-zinc-200">{row.free}</td>
                  <td className="px-2 py-3 text-right tabular-nums text-pink-300">{row.premium}</td>
                  <td className="px-2 py-3 text-right font-semibold tabular-nums text-white">{row.total}</td>
                  <td className="px-2 py-3 text-right tabular-nums text-zinc-500">{row.inactive}</td>
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenList({ mode: row.mode })}
                      className="rounded text-xs font-semibold text-pink-300 hover:text-pink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                    >
                      Voir →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Alertes */}
      {(invisibleIds.size > 0 || premiumWaiting > 0) && (
        <Panel className="border-amber-500/25 bg-amber-500/[0.04]">
          <SectionTitle title="À surveiller" />
          <ul className="space-y-3 text-sm">
            {invisibleIds.size > 0 && (
              <li className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-zinc-200">
                  <b className="tabular-nums text-amber-300">{invisibleIds.size}</b> carte(s) active(s) d'un mode en ligne
                  ne sortent dans aucune configuration (souvent un doublon de texte : garde-en une, désactive l'autre).
                </span>
                <Button onClick={() => onOpenList({ visibility: 'invisible' })}>Les voir</Button>
              </li>
            )}
            {premiumWaiting > 0 && (
              <li className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-zinc-200">
                  <b className="tabular-nums text-amber-300">{premiumWaiting}</b> carte(s) Premium attendent dans des modes
                  pas encore en ligne (Deep, T'as la réf).
                </span>
                <Button onClick={() => onOpenList({ access: 'premium', status: 'active', mode: 'all', visibility: 'waiting' })}>
                  Les voir
                </Button>
              </li>
            )}
          </ul>
        </Panel>
      )}
    </div>
  );
};

export default AdminDashboard;
