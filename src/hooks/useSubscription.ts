
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkoutUrl, hasStripeConfigured, STRIPE_PORTAL_URL } from '@/lib/premium';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  loading: boolean;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    loading: true,
  });
  const { toast } = useToast();

  // Lit le statut premium directement depuis la table `subscribers`
  // (alimentée par le webhook Stripe). Pas d'Edge Function côté lecture.
  const checkSubscription = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus({ subscribed: false, loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      // Abonnement valide = flag actif ET (pas de date de fin OU date future)
      const notExpired =
        !data?.subscription_end || new Date(data.subscription_end) > new Date();
      const subscribed = !!data?.subscribed && notExpired;

      setStatus({
        subscribed,
        subscription_tier: data?.subscription_tier ?? undefined,
        subscription_end: data?.subscription_end ?? undefined,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus({ subscribed: false, loading: false });
    }
  };

  // Ouvre le Payment Link Stripe avec client_reference_id = user.id.
  // L'utilisateur doit être connecté (pour pouvoir l'identifier au retour).
  const createCheckoutSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Connexion requise',
          description: 'Vous devez être connecté pour vous abonner',
          variant: 'destructive',
        });
        return { success: false, needsAuth: true };
      }

      if (!hasStripeConfigured()) {
        toast({
          title: 'Paiement indisponible',
          description: "Le lien d'abonnement n'est pas encore configuré.",
          variant: 'destructive',
        });
        return { success: false, error: 'Stripe non configuré' };
      }

      const url = checkoutUrl(session.user.id);
      const newWindow = window.open(url, '_blank');

      // Popup bloqué → fallback même fenêtre après confirmation
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const confirmRedirect = confirm(
          'Le popup a été bloqué. Voulez-vous ouvrir la page de paiement dans cette fenêtre ?'
        );
        if (confirmRedirect) {
          window.location.href = url;
        } else {
          return { success: false, error: 'Popup bloqué par le navigateur' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error opening checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur d'abonnement",
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  // Ouvre le portail client Stripe (gestion / résiliation).
  const openCustomerPortal = async () => {
    if (!STRIPE_PORTAL_URL) {
      toast({
        title: 'Portail indisponible',
        description: "Le portail de gestion n'est pas encore configuré.",
        variant: 'destructive',
      });
      return;
    }
    window.open(STRIPE_PORTAL_URL, '_blank');
  };

  useEffect(() => {
    checkSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkSubscription();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...status,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
  };
};
