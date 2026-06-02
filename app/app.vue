<template>
  <!-- NuxtLayout で囲むことで layouts/default.vue が適用されます -->
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { fetchAllMasters } = useMasterData();

onMounted(async () => {
  await fetchAllMasters();
});
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background-color: #f8fafc; /* bg-slate-50 相当 */
  color: #0f172a; /* text-slate-900 相当 */
}
</style>
