const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        Sentry.httpIntegration({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        // nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,      // Capture 100% of the transactions
    profilesSampleRate: 1.0,    // Sampling rate relative to tracesSampleRate
});