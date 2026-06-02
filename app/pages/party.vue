<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span class="text-3xl">👥</span> パーティー熟練度設定
    </h1>

    <div v-if="!isLoaded" class="flex justify-center p-10">
      <div
        class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-8">
      <!-- キャラクターごとの設定カード -->
      <section
        v-for="(char, charIdx) in partyProficiency"
        :key="charIdx"
        class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
      >
        <input
          v-model="characterNames[charIdx]"
          type="text"
          class="text-xl font-semibold bg-transparent border-none p-0 focus:ring-0 text-blue-400 placeholder-slate-600 w-full"
          :placeholder="`キャラクター ${charIdx + 1}`"
        />

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="weapon in weaponList"
            :key="weapon"
            class="flex flex-col gap-1"
          >
            <label class="text-xs text-slate-400 truncate">{{ weapon }}</label>
            <input
              v-model.number="char[weapon]"
              type="number"
              min="0"
              max="10"
              class="bg-white border border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
            />
          </div>
        </div>
      </section>

      <div class="mt-4 flex items-center justify-end gap-2 px-2">
        <p
          class="text-sm text-slate-500 font-medium flex items-center gap-1.5 transition-opacity duration-300"
        >
          <span class="text-emerald-500 text-lg">✓</span>
          入力した数値は自動的に保存されます。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// composablesから自動インポートされるため、明示的なimportは不要です
const { isLoaded, weaponList, fetchAllMasters } = useMasterData();
const { partyProficiency, characterNames } = useUserData();

// マスタデータが未取得の場合は取得
onMounted(async () => {
  await fetchAllMasters();
});
</script>
