const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.anrIntegration({ captureStackTrace: true })],
  environment: process.env.NODE_ENV || 'production',
  enabled: true,
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // Sampling rate relative to tracesSampleRate
});
