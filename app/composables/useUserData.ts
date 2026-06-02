import { useLocalStorage } from "@vueuse/core";

export const useUserData = () => {
  const { weaponList, isLoaded } = useMasterData();

  const characterNames = useLocalStorage<string[]>("dqw-character-names", [
    "キャラクター1",
    "キャラクター2",
    "キャラクター3",
    "キャラクター4",
  ]);

  // キャラクターごとの熟練度：[武器種名: 練度] のMap形式にすると順序に依存せず安全
  const partyProficiency = useLocalStorage<Record<string, number>[]>(
    "dqw-party-proficiency",
    Array.from({ length: 4 }, () => ({})),
  );

  const inventoryStones = useLocalStorage<Record<string, number>>(
    "dqw-inventory-stones",
    {},
  );
  const inventoryGold = useLocalStorage<number>("dqw-inventory-gold", 0);

  // データロード完了時に未定義の武器を0で埋める
  watch(
    isLoaded,
    (loaded) => {
      if (loaded) {
        partyProficiency.value.forEach((char) => {
          weaponList.value.forEach((w) => {
            if (char[w] === undefined) char[w] = 0;
          });
        });
      }
    },
    { immediate: true },
  );

  return { characterNames, partyProficiency, inventoryStones, inventoryGold };
};
