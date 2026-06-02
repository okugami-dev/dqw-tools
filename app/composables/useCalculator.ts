export const useCalculator = () => {
  const { masterData, weaponList } = useMasterData();
  const { partyProficiency, characterNames } = useUserData();

  const calculate = (targetLevel: number = 10) => {
    const charResults = partyProficiency.value.map((char, idx) => {
      let neededGold = 0;
      let neededStones: Record<string, number> = {};

      weaponList.value.forEach((weapon) => {
        const currentLevel = char[weapon] || 0;
        // 練度マスタから必要分を抽出
        const proficiencyMaster = masterData.value.proficiency || [];
        const requirements = proficiencyMaster.filter(
          (r) =>
            r.武器種 === weapon &&
            r.練度 > currentLevel &&
            r.練度 <= targetLevel,
        );

        requirements.forEach((row) => {
          neededGold += row.ゴールド || 0;
          Object.keys(row).forEach((key) => {
            if (key.includes("石版")) {
              // 「石版」を含む列を合算
              neededStones[key] = (neededStones[key] || 0) + (row[key] || 0);
            }
          });
        });
      });

      return {
        name: characterNames.value[idx],
        gold: neededGold,
        stones: neededStones,
      };
    });

    // 合計の算出
    const total = charResults.reduce(
      (acc, cur) => {
        acc.gold += cur.gold;
        Object.entries(cur.stones).forEach(([key, val]) => {
          acc.stones[key] = (acc.stones[key] || 0) + val;
        });
        return acc;
      },
      { name: "合計", gold: 0, stones: {} as Record<string, number> },
    );

    return [...charResults, total];
  };

  return { calculate };
};
