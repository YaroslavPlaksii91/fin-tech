import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000
  },
  resolve: {
    alias: [
      {
        find: '@components',
        replacement: resolve(__dirname, './src/components')
      },
      {
        find: '@store',
        replacement: resolve(__dirname, './src/store')
      },
      {
        find: '@hooks',
        replacement: resolve(__dirname, './src/hooks')
      },
      {
        find: '@pages',
        replacement: resolve(__dirname, './src/pages')
      },
      {
        find: '@utils',
        replacement: resolve(__dirname, './src/utils')
      },
      {
        find: '@public',
        replacement: resolve(__dirname, './src/public')
      },
      {
        find: '@constants',
        replacement: resolve(__dirname, './src/constants')
      },
      {
        find: '@services',
        replacement: resolve(__dirname, './src/services')
      },
      {
        find: '@domain',
        replacement: resolve(__dirname, './src/domain')
      },
      {
        find: '@hook',
        replacement: resolve(__dirname, './src/hook')
      },
      {
        find: '@contexts',
        replacement: resolve(__dirname, './src/contexts')
      },
      {
        find: '@views',
        replacement: resolve(__dirname, './src/views')
      },
      {
        find: '@theme',
        replacement: resolve(__dirname, './src/themeConfig')
      }
    ]
  }
}));
