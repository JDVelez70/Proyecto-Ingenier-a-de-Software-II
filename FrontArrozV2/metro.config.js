const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 👇 Agregamos la extensión del modelo
config.resolver.assetExts.push('tflite');

module.exports = config;
