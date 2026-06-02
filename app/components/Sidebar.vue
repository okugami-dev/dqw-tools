<!-- components/Sidebar.vue -->
<template>
  <aside
    :class="[isCollapsed ? 'w-16' : 'w-64']"
    class="flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 shrink-0"
  >
    <!-- トグルボタンエリア -->
    <div class="p-4 border-b border-slate-50 flex justify-center">
      <button
        @click="isCollapsed = !isCollapsed"
        class="p-2 hover:bg-slate-100 rounded-lg"
      >
        <span>{{ isCollapsed ? "➡️" : "⬅️" }}</span>
      </button>
    </div>

    <!-- ナビゲーションエリア -->
    <nav class="flex-1 py-4 flex flex-col gap-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center px-4 py-3 hover:bg-slate-50 text-slate-600 no-underline"
        :class="[isCollapsed ? 'justify-center' : 'justify-start gap-4']"
        active-class="bg-blue-50 !text-blue-600 border-r-4 border-blue-600"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span v-if="!isCollapsed" class="font-medium whitespace-nowrap">{{
          item.name
        }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const isCollapsed = ref(false);
const menuItems = [
  { to: "/", name: "メイン（計算）", icon: "📊" },
  { to: "/party", name: "パーティー設定", icon: "👥" },
  { to: "/inventory", name: "所持品設定", icon: "🎒" },
];
</script>
