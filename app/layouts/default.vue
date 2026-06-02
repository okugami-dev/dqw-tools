<!-- app/layouts/default.vue -->
<template>
  <div class="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
    <!-- サイドバーコンポーネント -->
    <Sidebar />

    <!-- メインコンテンツ -->
    <main class="flex-1 overflow-y-auto relative">
      <div class="p-6 md:p-10">
        <slot />
      </div>
    </main>
  </div>
</template>

<style>
/* 念のため、ブラウザのデフォルトマージンを消します */
body {
  margin: 0;
  padding: 0;
}
</style>
