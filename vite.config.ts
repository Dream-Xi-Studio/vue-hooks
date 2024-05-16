import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginDts from 'vite-plugin-dts'
import path from 'path'

function resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

export default defineConfig({
  plugins: [
    vue(),
    vitePluginDts({
      outDir: 'dist',
      include: 'src/**/*.ts',
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve('src/index.ts'),
      name: 'VueHooks',
      formats: ['es', 'cjs'],
      fileName: format => `vue-hooks.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
})
