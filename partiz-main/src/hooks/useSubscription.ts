
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  loading: boolean;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    loading: true
  });
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus({ subscribed: false, loading: false });
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end,
        loading: false
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus({ subscribed: false, loading: false });
    }
  };

  const createCheckoutSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour vous abonner",
          variant: "destructive"
        });
        return { success: false };
      }

      console.log('Creating checkout session...', { userId: session.user.id, email: session.user.email });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erreur lors de la création de la session');
      }

      if (data?.error) {
        console.error('Checkout session error:', data.error);
        throw new Error(data.error);
      }

      if (data?.url) {
        console.log('Redirecting to checkout:', data.url);
        
        // Essayer d'ouvrir dans un nouvel onglet d'abord
        const newWindow = window.open(data.url, '_blank');
        
        // Si le popup est bloqué, proposer d'ouvrir dans la même fenêtre
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          console.warn('Popup bloqué par le navigateur, redirection dans la même fenêtre');
          
          // Demander confirmation avant de rediriger dans la même fenêtre
          const confirmRedirect = confirm(
            'Le popup a été bloqué par votre navigateur. Voulez-vous ouvrir Stripe dans cette fenêtre ? (Vous pourrez revenir en arrière après le paiement)'
          );
          
          if (confirmRedirect) {
            window.location.href = data.url;
          } else {
            toast({
              title: "Popup bloqué",
              description: "Veuillez autoriser les popups pour ce site ou cliquer à nouveau pour ouvrir dans cette fenêtre",
              variant: "destructive"
            });
            return { success: false, error: 'Popup bloqué par le navigateur' };
          }
        }
        
        return { success: true };
      } else {
        throw new Error('URL de paiement manquante');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      toast({
        title: "Erreur d'abonnement",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le portail client",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    checkSubscription();

    // Listen for auth changes
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
    openCustomerPortal
  };
};
