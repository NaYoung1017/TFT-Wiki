// 수집된 데이터를 분석하여 메타 통계 생성
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("=== 메타 분석 시작 ===");

  try {
    const matchData = global.masterMatchData || [];

    if (matchData.length === 0) {
      return res.status(400).json({
        error: "분석할 데이터가 없습니다",
        message: "/api/collect-master-data를 먼저 실행하세요",
      });
    }

    console.log("분석할 매치 수:", matchData.length);

    // 메타 컴포지션 패턴 분석
    const compPatterns = {};
    const synergyStats = {};
    const itemStats = {};
    const augmentStats = {};
    const championStats = {};

    matchData.forEach((match) => {
      match.info.participants.forEach((participant) => {
        // 시너지 조합 추출 (활성화된 시너지만)
        const activeTraits = participant.traits
          .filter((t) => t.tier_current > 0)
          .sort((a, b) => b.tier_current - a.tier_current)
          .map((t) => t.name.replace("TFT15_", "").replace("Set15_", ""));

        // 주요 시너지 (tier 2 이상)
        const mainTraits = participant.traits
          .filter((t) => t.tier_current >= 2)
          .map((t) => t.name.replace("TFT15_", "").replace("Set15_", ""));

        // 컴포지션 키 생성 (주요 시너지 조합)
        const compKey = mainTraits.sort().join(" + ") || "Unknown";

        if (!compPatterns[compKey]) {
          compPatterns[compKey] = {
            name: compKey,
            games: 0,
            totalPlacement: 0,
            top4: 0,
            wins: 0,
            champions: {},
            items: {},
            augments: {},
            traits: mainTraits,
            avgLevel: 0,
            totalLevel: 0,
          };
        }

        const comp = compPatterns[compKey];
        comp.games++;
        comp.totalPlacement += participant.placement;
        comp.totalLevel += participant.level;
        if (participant.placement <= 4) comp.top4++;
        if (participant.placement === 1) comp.wins++;

        // 챔피언 사용 빈도
        participant.units.forEach((unit) => {
          const champName = unit.character_id
            .replace("TFT15_", "")
            .replace("TFT_", "");
          comp.champions[champName] = (comp.champions[champName] || 0) + 1;

          // 전체 챔피언 통계
          if (!championStats[champName]) {
            championStats[champName] = {
              name: champName,
              cost: unit.tier,
              games: 0,
              totalPlacement: 0,
              items: {},
            };
          }
          championStats[champName].games++;
          championStats[champName].totalPlacement += participant.placement;

          // 아이템 조합
          if (unit.itemNames && unit.itemNames.length > 0) {
            const itemKey = unit.itemNames.sort().join(" + ");
            comp.items[itemKey] = (comp.items[itemKey] || 0) + 1;

            // 챔피언별 아이템
            unit.itemNames.forEach((item) => {
              if (!championStats[champName].items[item]) {
                championStats[champName].items[item] = 0;
              }
              championStats[champName].items[item]++;
            });
          }
        });

        // 증강 사용 빈도
        if (participant.augments) {
          participant.augments.forEach((aug) => {
            const augName = aug
              .replace("TFT15_Augment_", "")
              .replace("TFT_Augment_", "");
            comp.augments[augName] = (comp.augments[augName] || 0) + 1;

            // 전체 증강 통계
            if (!augmentStats[augName]) {
              augmentStats[augName] = {
                name: augName,
                games: 0,
                totalPlacement: 0,
                top4: 0,
              };
            }
            augmentStats[augName].games++;
            augmentStats[augName].totalPlacement += participant.placement;
            if (participant.placement <= 4) augmentStats[augName].top4++;
          });
        }

        // 시너지 통계
        activeTraits.forEach((trait) => {
          if (!synergyStats[trait]) {
            synergyStats[trait] = {
              name: trait,
              games: 0,
              totalPlacement: 0,
              top4: 0,
              wins: 0,
            };
          }
          synergyStats[trait].games++;
          synergyStats[trait].totalPlacement += participant.placement;
          if (participant.placement <= 4) synergyStats[trait].top4++;
          if (participant.placement === 1) synergyStats[trait].wins++;
        });
      });
    });

    // 평균 계산 및 정렬
    const metaComps = Object.values(compPatterns)
      .filter((comp) => comp.games >= 5) // 최소 5게임 이상
      .map((comp) => ({
        ...comp,
        avgPlacement: (comp.totalPlacement / comp.games).toFixed(2),
        avgLevel: (comp.totalLevel / comp.games).toFixed(1),
        winRate: ((comp.wins / comp.games) * 100).toFixed(1),
        top4Rate: ((comp.top4 / comp.games) * 100).toFixed(1),
        pickRate: ((comp.games / matchData.length) * 100).toFixed(1),
        // 자주 사용된 챔피언 (상위 7개)
        topChampions: Object.entries(comp.champions)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)
          .map(([name, count]) => ({ name, count })),
        // 자주 사용된 아이템 (상위 3개)
        topItems: Object.entries(comp.items)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([combo, count]) => ({ combo, count })),
        // 자주 사용된 증강 (상위 3개)
        topAugments: Object.entries(comp.augments)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, count]) => ({ name, count })),
      }))
      .sort((a, b) => parseFloat(a.avgPlacement) - parseFloat(b.avgPlacement))
      .slice(0, 20); // 상위 20개

    // 시너지 통계 계산
    const synergyRankings = Object.values(synergyStats)
      .filter((s) => s.games >= 10)
      .map((s) => ({
        ...s,
        avgPlacement: (s.totalPlacement / s.games).toFixed(2),
        winRate: ((s.wins / s.games) * 100).toFixed(1),
        top4Rate: ((s.top4 / s.games) * 100).toFixed(1),
        pickRate: ((s.games / (matchData.length * 8)) * 100).toFixed(1),
      }))
      .sort((a, b) => parseFloat(a.avgPlacement) - parseFloat(b.avgPlacement));

    // 증강 통계 계산
    const augmentRankings = Object.values(augmentStats)
      .filter((a) => a.games >= 10)
      .map((a) => ({
        ...a,
        avgPlacement: (a.totalPlacement / a.games).toFixed(2),
        top4Rate: ((a.top4 / a.games) * 100).toFixed(1),
        pickRate: ((a.games / (matchData.length * 8 * 3)) * 100).toFixed(1),
      }))
      .sort((a, b) => parseFloat(a.avgPlacement) - parseFloat(b.avgPlacement));

    // 챔피언 통계 계산
    const championRankings = Object.values(championStats)
      .filter((c) => c.games >= 20)
      .map((c) => ({
        ...c,
        avgPlacement: (c.totalPlacement / c.games).toFixed(2),
        pickRate: ((c.games / (matchData.length * 8)) * 100).toFixed(1),
        topItems: Object.entries(c.items)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, count]) => ({ name, count })),
      }))
      .sort((a, b) => parseFloat(a.avgPlacement) - parseFloat(b.avgPlacement));

    // 분석 결과 저장
    global.analyzedData = {
      metaComps,
      synergyRankings,
      augmentRankings,
      championRankings,
      totalMatches: matchData.length,
      lastAnalyzed: new Date(),
    };

    console.log("=== 분석 완료 ===");
    console.log("메타 컴포지션:", metaComps.length);
    console.log("시너지 통계:", synergyRankings.length);
    console.log("증강 통계:", augmentRankings.length);

    return res.status(200).json({
      success: true,
      metaComps: metaComps.length,
      synergies: synergyRankings.length,
      augments: augmentRankings.length,
      champions: championRankings.length,
      totalMatches: matchData.length,
    });
  } catch (error) {
    console.error("❌ 분석 에러:", error.message);

    return res.status(500).json({
      error: "데이터 분석 중 오류 발생",
      details: error.message,
    });
  }
}
