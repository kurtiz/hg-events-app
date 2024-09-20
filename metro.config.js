const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
    input: './global.css',
    output: './node_modules/nativewind/.cache/nativewind-output.css',
});