// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegurarnos de que resolver y sus arrays existen
config.resolver = config.resolver || {};
config.resolver.assetExts = Array.isArray(config.resolver.assetExts) ? config.resolver.assetExts : [];
config.resolver.sourceExts = Array.isArray(config.resolver.sourceExts) ? config.resolver.sourceExts : [];

// Extensiones para assets (modelos, binarios, JSON)
config.resolver.assetExts = [
  ...new Set([
    ...config.resolver.assetExts,
    'tflite',
    'bin',
    'json',
  ]),
];

// Extensiones de fuente (módulos)
config.resolver.sourceExts = [
  ...new Set([
    ...config.resolver.sourceExts,
    'cjs',
    'mjs',
  ]),
];

module.exports = config;
