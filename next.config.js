/* eslint-disable @typescript-eslint/no-var-requires */
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
// @ts-check
/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  images: {
    disableStaticImages: true // Can turned off when this will be released https://github.com/vercel/next.js/releases/tag/v11.0.1-canary.4
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /icons.*\.svg$/,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: ['svg-sprite-loader']
    });

    config.plugins.push(
      new SpriteLoaderPlugin({
        plainSprite: true
      })
    );

    return config;
  },
  publicRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV
  }
};

module.exports = nextConfig;
