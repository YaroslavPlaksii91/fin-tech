import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    svgr({
      svgrOptions: { exportType: 'default' },
      include: '**/*.svg'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }

          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }

          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
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
        find: '@hocs',
        replacement: resolve(__dirname, './src/hocs')
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
      },
      {
        find: '@icons',
        replacement: resolve(__dirname, './src/assets/icons')
      },
      {
        find: '@images',
        replacement: resolve(__dirname, './src/assets/images')
      }
    ]
  }
}));
