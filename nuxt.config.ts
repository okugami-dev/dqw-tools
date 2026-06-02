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
  // サーバービルドのインライン化対象から外す
  nitro: {
    externals: {
      inline: ["papaparse"],
    },
  },
});
