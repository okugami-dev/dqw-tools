export const useMasterData = () => {
  const masterData = useState<Record<string, any[]>>("master-data", () => ({}));
  const isLoaded = useState("master-data-loaded", () => false);

  // CSVのURLリスト（gidで各シートを指定）
  const urls = {
    proficiency:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bACSAxfHLR66ifrQ8PY2TP7dk1pIU27ohwXN6Gbj9jKKLI0y-nJfkijrA5z5wwNlSsIz6w3yw1B0/pub?gid=0&single=true&output=csv",
    proficiencyMaster:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bACSAxfHLR66ifrQ8PY2TP7dk1pIU27ohwXN6Gbj9jKKLI0y-nJfkijrA5z5wwNlSsIz6w3yw1B0/pub?gid=803411378&single=true&output=csv",
    weapons:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bACSAxfHLR66ifrQ8PY2TP7dk1pIU27ohwXN6Gbj9jKKLI0y-nJfkijrA5z5wwNlSsIz6w3yw1B0/pub?gid=1784466756&single=true&output=csv",
    stoneColors:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bACSAxfHLR66ifrQ8PY2TP7dk1pIU27ohwXN6Gbj9jKKLI0y-nJfkijrA5z5wwNlSsIz6w3yw1B0/pub?gid=1949752487&single=true&output=csv",
    stoneTypes:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bACSAxfHLR66ifrQ8PY2TP7dk1pIU27ohwXN6Gbj9jKKLI0y-nJfkijrA5z5wwNlSsIz6w3yw1B0/pub?gid=1043652440&single=true&output=csv",
    stones:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bACSAxfHLR66ifrQ8PY2TP7dk1pIU27ohwXN6Gbj9jKKLI0y-nJfkijrA5z5wwNlSsIz6w3yw1B0/pub?gid=471287012&single=true&output=csv",
  };

  // app/composables/useMasterData.ts 内の fetchAllMasters を修正
  const fetchAllMasters = async () => {
    if (isLoaded.value) return;

    const tasks = Object.entries(urls).map(async ([key, url]) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();

      const Papa = await import("papaparse").then((m) => m.default || m);

      return new Promise<void>((resolve) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            masterData.value[key] = results.data;
            resolve();
          },
          // err に型を指定して ts(7006) を解消
          error: (err: any) => {
            resolve();
          },
        });
      });
    });

    await Promise.all(tasks);
    isLoaded.value = true;
  };

  // 武器種リストを動的に抽出
  const weaponList = computed(
    () => masterData.value.weapons?.map((w) => w.武器種) || [],
  );
  // 石板色・種リスト
  const stoneColorList = computed(
    () => masterData.value.stoneColors?.map((c) => c.石版色) || [],
  );
  const stoneTypeList = computed(
    () => masterData.value.stoneTypes?.map((t) => t.石版種) || [],
  );

  const proficiencyList = computed(
    () => masterData.value.proficiencyMaster || [],
  ); // ドロップダウン用

  return {
    fetchAllMasters,
    isLoaded,
    masterData,
    weaponList,
    stoneColorList,
    stoneTypeList,
    proficiencyList,
  };
};
