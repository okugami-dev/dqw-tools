// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },
  devtools: { enabled: true },
  nitro: {
    // 1. サーバービルドの対象から明示的に除外
    externals: {
      external: ["papaparse"],
    },
    // 2. Rollup自体に「papaparseは外部モジュールだから解析（パース）しないで」と直接伝える
    rollupConfig: {
      external: ["papaparse"],
    },
  },
});
