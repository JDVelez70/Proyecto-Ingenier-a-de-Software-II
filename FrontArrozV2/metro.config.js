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
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 👇 Agregamos la extensión del modelo
config.resolver.assetExts.push('tflite');

module.exports = config;
