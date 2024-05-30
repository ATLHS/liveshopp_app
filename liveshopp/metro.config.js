const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
