
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import './index.css';

// Monitoring d'erreurs (Sentry). INERTE tant que VITE_SENTRY_DSN n'est pas
// défini dans les variables d'environnement Vercel → rien ne part en local ni
// avant que tu ne colles le DSN. Aucune donnée perso capturée (pas de replay).
const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    // Échantillonnage léger des traces de perf (10%).
    tracesSampleRate: 0.1,
    // On n'envoie pas les erreurs déclenchées en développement.
    enabled: import.meta.env.PROD,
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
