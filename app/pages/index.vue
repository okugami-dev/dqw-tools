<template>
  <div class="max-w-[98%] mx-auto px-4">
    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span class="text-3xl">📊</span> 武器熟練度 必要数計算
    </h1>

    <!-- 読み込み中、またはマスタが空の場合の表示 -->
    <!-- 修正: !proficiencyList.length を追加し、マスタが空の間のエラーを防ぎます -->
    <div
      v-if="!isLoaded || !proficiencyList.length"
      class="flex flex-col items-center justify-center p-20 gap-4">
      <div
        class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent">
      </div>
      <p class="text-slate-400 font-mono text-sm">
        マスターデータをロード中...
      </p>
    </div>

    <div v-else class="space-y-6">
      <!-- 目標設定 -->
      <div
        class="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-4">
        <label class="font-bold text-sm">目標練度:</label>

        <!-- 【修正ポイント1】マスタから動的に選択肢を生成 -->
        <select
          v-model.number="targetLevel"
          class="bg-white border border-slate-300 rounded px-3 py-1 outline-none text-sm text-slate-900">
          <!-- マスタの「レベル」を値にし、「レベル」と「称号」を表示名にする -->
          <option v-for="p in proficiencyList" :key="p.練度" :value="p.練度">
            {{ p.練度 }}
          </option>
        </select>
      </div>

      <!-- 計算結果テーブル -->
      <!-- 修正: calculationResults.length がなくても枠だけは出せるようガードを調整 -->
      <div
        v-if="calculationResults.length"
        class="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-700">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-100">
              <th class="p-4 border-b border-slate-600">項目</th>
              <th class="p-4 border-b border-slate-600 text-right text-yellow-500">
                ゴールド
              </th>
              <th
                v-for="stone in allNeededStoneKeys"
                :key="stone"
                class="p-4 border-b border-slate-600 text-right text-xs whitespace-nowrap">
                {{ getStoneShortName(stone) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="res in calculationResults"
              :key="res.name"
              :class="{ 'bg-slate-700/30 font-bold': res.name === '合計' }">
              <td class="p-4 border-b border-slate-700 whitespace-nowrap">
                {{ res.name }}
              </td>
              <td class="p-4 border-b border-slate-700 text-right font-mono">
                {{ res.gold.toLocaleString() }}
              </td>
              <td
                v-for="stone in allNeededStoneKeys"
                :key="stone"
                class="p-4 border-b border-slate-700 text-right font-mono">
                {{ res.stones[stone] || 0 }}
              </td>
            </tr>
            <!-- 不足分行 -->
            <tr class="bg-red-900/10 border-t-2 border-red-900/50">
              <td class="p-4 font-bold text-red-400">現在の不足分</td>
              <td
                class="p-4 text-right font-mono"
                :class="shortage.gold > 0 ? 'text-red-500' : 'text-slate-500'">
                {{ shortage.gold.toLocaleString() }}
              </td>
              <td
                v-for="stone in allNeededStoneKeys"
                :key="stone"
                class="p-4 text-right font-mono"
                :class="
                  shortage.stones[stone] > 0 ? 'text-red-500' : 'text-slate-500'
                ">
                {{ shortage.stones[stone] || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 計算結果がない場合のメッセージ -->
      <div v-else class="text-center p-10 text-slate-500">
        計算結果がありません。目標レベルを調整してください。
      </div>
    </div>
  </div>
</template>

<script setup>
// composablesから自動インポート
const { fetchAllMasters, isLoaded, masterData, proficiencyList } =
  useMasterData();
const { inventoryGold, inventoryStones, characterNames } = useUserData();
const { calculate } = useCalculator();

// 【修正ポイント2】初期値は「先頭（1）」とする。
// マスタロード後に自動でセットしたい場合は watch を使うことも可能ですが、
// 概要仕様通り「デフォルト1」で初期化します。
const targetLevel = ref(1);

onMounted(async () => {
  await fetchAllMasters();
});

// 計算結果（データがないときは空配列を返すようにガード）
const calculationResults = computed(() => {
  // 【修正ポイント3】isLoaded だけでなく proficiencyList の存在も確認
  if (!isLoaded.value || !proficiencyList.value.length) return [];
  const res = calculate(targetLevel.value);
  return res || [];
});

// 合計行
const totalRow = computed(() => {
  if (!calculationResults.value.length) return { gold: 0, stones: {} };
  return (
    calculationResults.value.find((r) => r.name === "合計") || {
      gold: 0,
      stones: {},
    }
  );
});

// 表示すべき石版のキー一覧（マスタのCSV順を維持）
const allNeededStoneKeys = computed(() => {
  // マスタがロードされていない、または計算結果がない場合は空
  if (
    !isLoaded.value ||
    !masterData.value?.stones ||
    !calculationResults.value.length
  )
    return [];

  // 現在の計算結果で1つでも必要数がある石板名を抽出
  const usedKeys = new Set();
  calculationResults.value.forEach((res) => {
    if (res?.stones) {
      Object.keys(res.stones).forEach((k) => {
        if (res.stones[k] > 0) usedKeys.add(k);
      });
    }
  });

  // マスタ（CSV）の並び順を維持したまま、計算に必要な石板だけに絞り込む
  return masterData.value.stones
    .map((s) => s.石版名)
    .filter((name) => usedKeys.has(name));
});

// 不足分の計算
const shortage = computed(() => {
  const goldDiff = (totalRow.value?.gold || 0) - (inventoryGold.value || 0);
  const stoneDiffs = {};

  allNeededStoneKeys.value.forEach((key) => {
    const diff =
      (totalRow.value?.stones?.[key] || 0) -
      (inventoryStones.value?.[key] || 0);
    stoneDiffs[key] = diff > 0 ? diff : 0;
  });

  return {
    gold: goldDiff > 0 ? goldDiff : 0,
    stones: stoneDiffs,
  };
});

const getStoneShortName = (fullName) => {
  const stone = masterData.value.stones.find((s) => s.石版名 === fullName);
  // 略称があれば返し、なければ正式名称をそのまま返す
  return stone?.略称 || fullName;
};
</script>

<style scoped>
/* 縦書き用のクラスをこのファイル限定で定義 */
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* ついでに、ヘッダーの高さに合わせてセルの幅を調整したい場合はここに追加できます */
th {
  min-width: 40px; /* 列が重なりすぎないように最小幅を確保 */
}
</style>
