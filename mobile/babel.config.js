module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Obligatoire pour Reanimated 4 (SDK 54) — doit rester le dernier plugin.
    plugins: ['react-native-worklets/plugin'],
  };
};
