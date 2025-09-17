//Para importar svg como componente
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    // Mejorar source maps para mejor debugging
    minifierConfig: {
      keep_fnames: true, // Mantener nombres de funciones
      mangle: {
        keep_fnames: true, // No ofuscar nombres de funciones
      },
    },
  };
  
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
