const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'tflite',
  'bin',
  'json'
];

config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'cjs',
  'mjs'
];

module.exports = config;