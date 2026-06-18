module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 54) ajoute automatiquement le plugin worklets
    // de Reanimated 4 ; pas besoin de l'ajouter manuellement.
    presets: ['babel-preset-expo'],
  };
};
