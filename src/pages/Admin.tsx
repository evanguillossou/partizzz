import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import AdminDashboard from '@/admin/AdminDashboard';
import AdminCardList, { DEFAULT_FILTERS, ListFilters } from '@/admin/AdminCardList';
import CardEditor from '@/admin/CardEditor';
import { AdminCard, emptyCard } from '@/admin/cardModel';
import { useAdminCards } from '@/admin/useAdminCards';
import { Button, Chip, cx } from '@/admin/ui';

type AdminState = 'checking' | 'admin' | 'denied' | 'setup-missing';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#0b0a0d] text-zinc-100">{children}</div>
);

const CenteredCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Shell>
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-7">
        <img src="/logo.png" alt="Partiz" className="mx-auto mb-5 h-12 w-auto object-contain" />
        {children}
      </div>
    </div>
  </Shell>
);

const Spinner = () => (
  <Shell>
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-pink-500" aria-label="Chargement" />
    </div>
  </Shell>
);

// ─── Connexion ──────────────────────────────────────────────────────────────

const LoginScreen: React.FC<{ onDevPreview?: () => void }> = ({ onDevPreview }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (authError) {
      setError(
        /invalid login credentials/i.test(authError.message)
          ? 'Email ou mot de passe incorrect.'
          : /email not confirmed/i.test(authError.message)
          ? "Cet email n'est pas encore confirmé."
          : authError.message
      );
    }
  };

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-[#141217] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400';

  return (
    <CenteredCard>
      <h1 className="text-center text-xl font-bold text-white">Back-office</h1>
      <p className="mt-1 text-center text-sm text-zinc-400">Accès réservé à l'administrateur.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mot de passe</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && (
          <p className="text-sm text-rose-300" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>
      {onDevPreview && (
        <button
          type="button"
          onClick={onDevPreview}
          className="mt-5 w-full rounded text-center text-xs text-zinc-500 underline hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          Aperçu sans connexion (lecture seule · développement)
        </button>
      )}
    </CenteredCard>
  );
};

// ─── Back-office ────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'cards';

const BackOffice: React.FC<{ email?: string; readOnly: boolean; onSignOut: () => void }> = ({ email, readOnly, onSignOut }) => {
  const { data: cards = [], isLoading, error, refetch } = useAdminCards();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [filters, setFilters] = useState<ListFilters>(DEFAULT_FILTERS);
  const [editing, setEditing] = useState<{ card: AdminCard; isNew: boolean } | null>(null);

  const openList = (patch: Partial<ListFilters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...patch });
    setTab('cards');
    window.scrollTo({ top: 0 });
  };

  const tabClass = (t: Tab) =>
    cx(
      'rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400',
      tab === t ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'
    );

  return (
    <Shell>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a0d]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-7 w-auto" />
            <span className="text-sm font-semibold text-zinc-300">Back-office</span>
          </div>
          <nav className="flex gap-1" aria-label="Sections">
            <button type="button" className={tabClass('dashboard')} onClick={() => setTab('dashboard')} aria-current={tab === 'dashboard'}>
              Tableau de bord
            </button>
            <button type="button" className={tabClass('cards')} onClick={() => setTab('cards')} aria-current={tab === 'cards'}>
              Cartes
            </button>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {readOnly ? <Chip tone="warn">Lecture seule</Chip> : <span className="hidden text-xs text-zinc-500 sm:inline">{email}</span>}
            <Link to="/" className="rounded text-xs font-semibold text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400">
              Voir le jeu ↗
            </Link>
            <Button variant="ghost" onClick={onSignOut} className="px-3 py-1.5 text-xs">
              {readOnly ? 'Quitter' : 'Se déconnecter'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {readOnly && (
          <p className="mb-5 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-200">
            Aperçu de développement : seules les cartes actives sont visibles et rien ne peut être enregistré.
          </p>
        )}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-pink-500" aria-label="Chargement" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-6 text-sm text-rose-200">
            <p>Impossible de charger les cartes : {(error as Error).message}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              Réessayer
            </Button>
          </div>
        ) : tab === 'dashboard' ? (
          <AdminDashboard cards={cards} onOpenList={openList} />
        ) : (
          <AdminCardList
            cards={cards}
            filters={filters}
            onFiltersChange={setFilters}
            readOnly={readOnly}
            onEdit={card => setEditing({ card, isNew: false })}
            onCreate={() =>
              setEditing({ card: emptyCard(filters.mode === 'all' ? 'normal' : filters.mode), isNew: true })
            }
          />
        )}
      </main>

      {editing && (
        <CardEditor
          key={editing.card.id}
          card={editing.card}
          isNew={editing.isNew}
          allCards={cards}
          readOnly={readOnly}
          onClose={() => setEditing(null)}
        />
      )}
    </Shell>
  );
};

// ─── Page /admin : contrôle d'accès ─────────────────────────────────────────

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [adminState, setAdminState] = useState<AdminState>('checking');
  const [devPreview, setDevPreview] = useState(false);

  useEffect(() => {
    document.title = 'Back-office · Partiz';
    // Page privée : ne pas la faire indexer par les moteurs de recherche.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => {
      listener.subscription.unsubscribe();
      robots.remove();
    };
  }, []);

  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) return;
    setAdminState('checking');
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (error) {
        // PGRST202 = la fonction is_admin n'existe pas encore (script SQL non exécuté)
        const missing = error.code === 'PGRST202' || /is_admin|does not exist|schema cache/i.test(error.message);
        setAdminState(missing ? 'setup-missing' : 'denied');
        return;
      }
      setAdminState(data ? 'admin' : 'denied');
    });
  }, [userId]);

  const signOut = async () => {
    setDevPreview(false);
    await supabase.auth.signOut();
  };

  if (devPreview) return <BackOffice readOnly onSignOut={() => setDevPreview(false)} />;
  if (!authReady) return <Spinner />;
  if (!session) return <LoginScreen onDevPreview={import.meta.env.DEV ? () => setDevPreview(true) : undefined} />;
  if (adminState === 'checking') return <Spinner />;

  if (adminState !== 'admin') {
    return (
      <CenteredCard>
        <h1 className="text-center text-lg font-bold text-white">
          {adminState === 'setup-missing' ? 'Configuration à terminer' : 'Accès refusé'}
        </h1>
        <p className="mt-3 text-center text-sm text-zinc-400">
          {adminState === 'setup-missing'
            ? "La sécurité du back-office n'est pas encore installée dans Supabase (script supabase/migration_admin_rls.sql)."
            : `Le compte ${session.user.email} n'est pas administrateur.`}
        </p>
        <Button className="mt-6 w-full" onClick={signOut}>
          Se déconnecter
        </Button>
      </CenteredCard>
    );
  }

  return <BackOffice email={session.user.email} readOnly={false} onSignOut={signOut} />;
};

export default Admin;
