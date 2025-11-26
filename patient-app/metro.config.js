const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable tree shaking and minification
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: false,
    keep_fnames: false,
    mangle: {
      keep_classnames: false,
      keep_fnames: false,
    },
  },
  minifierPath: 'metro-minify-terser',
};

// Optimize resolver for better performance
config.resolver = {
  ...config.resolver,
  alias: {
    // Add any aliases here if needed
  },
};

module.exports = config;