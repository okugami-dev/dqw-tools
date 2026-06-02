<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span class="text-3xl">🎒</span> 所持品設定
    </h1>

    <div v-if="!isLoaded" class="flex justify-center p-10">
      <div
        class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-8">
      <!-- 所持金設定 -->
      <section
        class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
      >
        <h2 class="text-xl font-semibold mb-4 text-yellow-500">💰 所持金</h2>
        <div class="flex items-center gap-4">
          <input
            v-model.number="inventoryGold"
            type="number"
            class="bg-white border border-slate-600 rounded px-4 py-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xl text-right"
          />
          <span class="text-slate-400">G</span>
        </div>
      </section>

      <!-- 石版設定 -->
      <section
        class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
      >
        <h2 class="text-xl font-semibold mb-4 text-blue-400">💎 所持石版</h2>

        <div class="space-y-6">
          <div v-for="color in stoneColorList" :key="color" class="space-y-2">
            <h3 class="text-sm font-bold text-slate-300">{{ color }}の石版</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="type in stoneTypeList"
                :key="type"
                class="flex flex-col gap-1"
              >
                <!-- CSVの石版名に合わせるロジック -->
                <label class="text-xs text-slate-500">
                  {{
                    type === "なし"
                      ? color + "の石版"
                      : type + "の" + color + "の石版"
                  }}
                </label>
                <input
                  v-model.number="inventoryStones[getStoneKey(color, type)]"
                  type="number"
                  min="0"
                  class="bg-white border border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="mt-4 flex items-center justify-end gap-2 px-2">
      <p
        class="text-sm text-slate-500 font-medium flex items-center gap-1.5 transition-opacity duration-300"
      >
        <span class="text-emerald-500 text-lg">✓</span>
        入力した数値は自動的に保存されます。
      </p>
    </div>
  </div>
</template>

<script setup>
const { isLoaded, stoneColorList, stoneTypeList, fetchAllMasters } =
  useMasterData();
const { inventoryStones, inventoryGold } = useUserData();

// CSV上の正確な「石版名」を生成するヘルパー
const getStoneKey = (color, type) => {
  return type === "なし" ? `${color}の石版` : `${type}の${color}の石版`;
};

onMounted(async () => {
  await fetchAllMasters();

  // 石版の初期値が undefined にならないよう初期化
  stoneColorList.value.forEach((color) => {
    stoneTypeList.value.forEach((type) => {
      const key = getStoneKey(color, type);
      if (inventoryStones.value[key] === undefined) {
        inventoryStones.value[key] = 0;
      }
    });
  });
});
</script>
