import { loadMatchData, saveAnalyzedData } from "../../utils/dataStorage";
import { getChampionCost } from "../../utils/tftDataLoader";

// 수집된 데이터를 분석하여 메타 통계 생성
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("=== 메타 분석 시작 ===");

  try {
    // 파일에서 로드 시도, 없으면 메모리에서
    let matchData = loadMatchData() || global.masterMatchData || [];

    if (matchData.length === 0) {
      return res.status(400).json({
        error: "분석할 데이터가 없습니다",
        message: "먼저 데이터를 수집하세요",
      });
    }

    console.log(`분석 중: ${matchData.length}개 매치`);

    // 메타 컴포지션 패턴 분석
    const compPatterns = {};
    const synergyStats = {};
    const itemStats = {};
    const augmentStats = {};
    const championStats = {};

    matchData.forEach((match) => {
      match.info.participants.forEach((participant) => {
        // 시너지 조합 추출 (활성화된 시너지만, 시즌 15만)
        const activeTraits = participant.traits
          .filter((t) => t.tier_current > 0 && (t.name.includes("TFT15_") || t.name.includes("Set15_")))
          .sort((a, b) => b.tier_current - a.tier_current)
          .map((t) => t.name.replace("TFT15_", "").replace("Set15_", ""));

        // 주요 시너지 (tier 2 이상, 시즌 15만)
        const mainTraits = participant.traits
          .filter((t) => t.tier_current >= 2 && (t.name.includes("TFT15_") || t.name.includes("Set15_")))
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
            championStars: {}, // 챔피언별 성급 통계
            items: {},
            itemDetails: {}, // 아이템 조합별 챔피언 정보
            augments: {},
            traits: mainTraits,
            avgLevel: 0,
            totalLevel: 0,
            levelPerformance: {}, // 레벨별 성적 통계
            earlyGamePerformance: { wins: 0, games: 0 }, // 2-1 ~ 3-2 성적
            midGamePerformance: { wins: 0, games: 0 },   // 3-5 ~ 4-1 성적
          };
        }

        const comp = compPatterns[compKey];
        comp.games++;
        comp.totalPlacement += participant.placement;
        comp.totalLevel += participant.level;
        if (participant.placement <= 4) comp.top4++;
        if (participant.placement === 1) comp.wins++;

        // 레벨별 성적 추적
        const level = participant.level;
        if (!comp.levelPerformance[level]) {
          comp.levelPerformance[level] = {
            games: 0,
            totalPlacement: 0,
            top4: 0,
          };
        }
        comp.levelPerformance[level].games++;
        comp.levelPerformance[level].totalPlacement += participant.placement;
        if (participant.placement <= 4) comp.levelPerformance[level].top4++;

        // 챔피언 사용 빈도 (시즌 15만)
        participant.units.forEach((unit) => {
          // 시즌 15 챔피언만 필터링
          if (!unit.character_id.includes("TFT15_")) return;

          const champName = unit.character_id
            .replace(/TFT15_/gi, "")
            .replace(/TFT_/gi, "")
            .toLowerCase();
          comp.champions[champName] = (comp.champions[champName] || 0) + 1;

          // 챔피언 성급 통계 (3성 챔피언 추적)
          const stars = unit.tier || 1; // 1성, 2성, 3성
          if (!comp.championStars[champName]) {
            comp.championStars[champName] = {
              total: 0,
              star1: 0,
              star2: 0,
              star3: 0,
              top4With3Star: 0,
              gamesWhen3Star: 0,
            };
          }
          comp.championStars[champName].total++;
          if (stars === 1) comp.championStars[champName].star1++;
          else if (stars === 2) comp.championStars[champName].star2++;
          else if (stars === 3) {
            comp.championStars[champName].star3++;
            comp.championStars[champName].gamesWhen3Star++;
            if (participant.placement <= 4) {
              comp.championStars[champName].top4With3Star++;
            }
          }

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

            // 아이템 조합별 챔피언 정보 저장
            if (!comp.itemDetails[itemKey]) {
              comp.itemDetails[itemKey] = {};
            }
            comp.itemDetails[itemKey][champName] = (comp.itemDetails[itemKey][champName] || 0) + 1;

            // 챔피언별 아이템
            unit.itemNames.forEach((item) => {
              if (!championStats[champName].items[item]) {
                championStats[champName].items[item] = 0;
              }
              championStats[champName].items[item]++;
            });
          }
        });

        // 증강 사용 빈도 (시즌 15만)
        if (participant.augments) {
          participant.augments.forEach((aug) => {
            // 시즌 15 증강만 필터링
            if (!aug.includes("TFT15_Augment_") && !aug.includes("TFT_Augment_")) return;

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
              champions: {},
              championStars: {},
              levelPerformance: {},
              totalLevel: 0,
            };
          }
          const synergy = synergyStats[trait];
          synergy.games++;
          synergy.totalPlacement += participant.placement;
          synergy.totalLevel += participant.level;
          if (participant.placement <= 4) synergy.top4++;
          if (participant.placement === 1) synergy.wins++;

          // 시너지별 레벨 성적
          const level = participant.level;
          if (!synergy.levelPerformance[level]) {
            synergy.levelPerformance[level] = {
              games: 0,
              totalPlacement: 0,
              top4: 0,
            };
          }
          synergy.levelPerformance[level].games++;
          synergy.levelPerformance[level].totalPlacement += participant.placement;
          if (participant.placement <= 4) synergy.levelPerformance[level].top4++;

          // 시너지별 챔피언 통계
          participant.units.forEach((unit) => {
            if (!unit.character_id.includes("TFT15_")) return;
            const champName = unit.character_id
              .replace(/TFT15_/gi, "")
              .replace(/TFT_/gi, "")
              .toLowerCase();

            synergy.champions[champName] = (synergy.champions[champName] || 0) + 1;

            // 시너지별 3성 챔피언 통계
            const stars = unit.tier || 1;
            if (!synergy.championStars[champName]) {
              synergy.championStars[champName] = {
                total: 0,
                star3: 0,
                top4With3Star: 0,
                gamesWhen3Star: 0,
              };
            }
            synergy.championStars[champName].total++;
            if (stars === 3) {
              synergy.championStars[champName].star3++;
              synergy.championStars[champName].gamesWhen3Star++;
              if (participant.placement <= 4) {
                synergy.championStars[champName].top4With3Star++;
              }
            }
          });
        });
      });
    });

    // 평균 계산 및 정렬
    const metaComps = Object.values(compPatterns)
      .filter((comp) => comp.games >= 5) // 최소 5게임 이상
      .map((comp) => {
        // 레벨별 덱 파워 계산
        const levelPowers = Object.entries(comp.levelPerformance)
          .map(([level, stats]) => ({
            level: parseInt(level),
            avgPlacement: (stats.totalPlacement / stats.games).toFixed(2),
            top4Rate: ((stats.top4 / stats.games) * 100).toFixed(1),
            games: stats.games,
          }))
          .sort((a, b) => a.level - b.level);

        // 3성 필수 챔피언 찾기 (3성 시 Top4 비율이 높고, 3성 빈도가 높은 챔피언)
        const keyChampions = Object.entries(comp.championStars)
          .filter(([name, stats]) => stats.star3 >= 2) // 3성이 최소 2번 이상
          .map(([name, stats]) => ({
            name,
            star3Count: stats.star3,
            star3Rate: ((stats.star3 / stats.total) * 100).toFixed(1),
            top4WhenStar3: stats.gamesWhen3Star > 0
              ? ((stats.top4With3Star / stats.gamesWhen3Star) * 100).toFixed(1)
              : 0,
            priority: stats.star3 * (stats.top4With3Star / Math.max(stats.gamesWhen3Star, 1)),
          }))
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 3);

        // 리롤 타이밍 분석 (레벨별 성적 기반)
        const getRerollTiming = () => {
          const timing = {
            earlyGame: { stage: "2-1 ~ 3-2", description: "", priority: "low" },
            midGame: { stage: "3-5 ~ 4-1", description: "", priority: "medium" },
            lateGame: { stage: "4-5 이후", description: "", priority: "low" },
          };

          // 컴포지션의 주요 챔피언들의 평균 코스트 계산
          const topChampionsForCost = Object.entries(comp.champions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          const avgCompCost = topChampionsForCost.length > 0
            ? topChampionsForCost.reduce((sum, [name, count]) => {
                const cost = getChampionCost(name);
                return sum + (cost || 3);
              }, 0) / topChampionsForCost.length
            : 3;

          // 저코스트 리롤 덱인지 판단 (평균 코스트 3 미만 && 3성 챔피언 있음)
          const isLowCostReroll = keyChampions.length > 0 && avgCompCost < 3;
          const avgLevelNum = parseFloat(comp.totalLevel / comp.games);

          if (isLowCostReroll) {
            timing.earlyGame.priority = "medium";
            timing.earlyGame.description = "2성 코어 챔피언 확보 시작";
            timing.midGame.priority = "high";
            timing.midGame.description = `3성 ${keyChampions[0]?.name || '메인 딜러'} 완성 집중, 50골드 유지`;
            timing.lateGame.description = "레벨업 후 남은 골드로 마무리 리롤";
          } else {
            timing.earlyGame.description = "연승/연패 전략 선택, 아이템 수급";
            timing.midGame.priority = "low";
            timing.midGame.description = "레벨업 우선, 핵심 유닛 2성 완성";
            timing.lateGame.priority = "high";
            timing.lateGame.description = `레벨 ${Math.ceil(avgLevelNum)} 달성 후 리롤로 덱 완성`;
          }

          return timing;
        };

        return {
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
            .map(([combo, count]) => {
              // 해당 아이템 조합을 사용하는 주요 챔피언 찾기
              const champions = comp.itemDetails[combo]
                ? Object.entries(comp.itemDetails[combo])
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([name, count]) => ({ name, count }))
                : [];
              return { combo, count, champions };
            }),
          // 자주 사용된 증강 (상위 3개)
          topAugments: Object.entries(comp.augments)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({ name, count })),
          // 레벨별 덱 파워
          levelPowers,
          // 3성 필수 챔피언
          keyChampions,
          // 리롤 타이밍
          rerollTiming: getRerollTiming(),
        };
      })
      .sort((a, b) => parseFloat(a.avgPlacement) - parseFloat(b.avgPlacement))
      .slice(0, 20); // 상위 20개

    // 시너지 통계 계산
    const synergyRankings = Object.values(synergyStats)
      .filter((s) => s.games >= 10)
      .map((s) => {
        // 레벨별 덱 파워
        const levelPowers = Object.entries(s.levelPerformance)
          .map(([level, stats]) => ({
            level: parseInt(level),
            avgPlacement: (stats.totalPlacement / stats.games).toFixed(2),
            top4Rate: ((stats.top4 / stats.games) * 100).toFixed(1),
            games: stats.games,
          }))
          .sort((a, b) => a.level - b.level);

        // 3성 필수 챔피언
        const keyChampions = Object.entries(s.championStars)
          .filter(([name, stats]) => stats.star3 >= 2)
          .map(([name, stats]) => ({
            name,
            star3Count: stats.star3,
            top4WhenStar3: stats.gamesWhen3Star > 0
              ? ((stats.top4With3Star / stats.gamesWhen3Star) * 100).toFixed(1)
              : 0,
            priority: stats.star3 * (stats.top4With3Star / Math.max(stats.gamesWhen3Star, 1)),
          }))
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 3);

        // 플레이 스타일 분석
        const avgLevel = parseFloat(s.totalLevel / s.games);
        const has3StarCarry = keyChampions.length > 0;

        // 시너지에 속한 모든 챔피언의 평균 코스트 계산 (가장 사용 빈도 높은 챔피언 기준)
        const topChampionsForCost = Object.entries(s.champions)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5); // 상위 5개 챔피언

        const avgSynergyCost = topChampionsForCost.length > 0
          ? topChampionsForCost.reduce((sum, [name, count]) => {
              const cost = getChampionCost(name);
              return sum + (cost || 3);
            }, 0) / topChampionsForCost.length
          : 3;

        // 저코스트 리롤 덱인지 판단 (평균 코스트 3 미만 && 3성 챔피언 있음)
        const isLowCostReroll = has3StarCarry && avgSynergyCost < 3;

        const playStyle = {
          type: isLowCostReroll ? "리롤 중심" : "레벨업 중심",
          description: isLowCostReroll
            ? `저코스트 캐리를 3성으로 완성하는 리롤 덱입니다`
            : `레벨업을 통해 고코스트 챔피언을 찾는 덱입니다`,
          goldTiming: {
            early: isLowCostReroll
              ? { stage: "2-1 ~ 3-2", action: "골드 수급", priority: "medium", desc: "이자 50골드 달성 우선" }
              : { stage: "2-1 ~ 3-2", action: "연승/연패", priority: "high", desc: "HP 관리하며 골드 수급" },
            mid: isLowCostReroll
              ? { stage: "3-5 ~ 4-1", action: "집중 리롤", priority: "high", desc: "50골드 유지하며 3성 완성" }
              : { stage: "3-5 ~ 4-1", action: "레벨업", priority: "high", desc: "7~8레벨 달성 목표" },
            late: isLowCostReroll
              ? { stage: "4-5 이후", action: "보강", priority: "low", desc: "남은 골드로 덱 완성" }
              : { stage: "4-5 이후", action: "올인", priority: "high", desc: "고코스트 챔피언 찾기 위해 리롤" },
          },
        };

        return {
          ...s,
          avgPlacement: (s.totalPlacement / s.games).toFixed(2),
          avgLevel: avgLevel.toFixed(1),
          winRate: ((s.wins / s.games) * 100).toFixed(1),
          top4Rate: ((s.top4 / s.games) * 100).toFixed(1),
          pickRate: ((s.games / (matchData.length * 8)) * 100).toFixed(1),
          levelPowers,
          keyChampions,
          playStyle,
          topChampions: Object.entries(s.champions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 7)
            .map(([name, count]) => ({ name, count })),
        };
      })
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
    const analyzedData = {
      metaComps,
      synergyRankings,
      augmentRankings,
      championRankings,
      totalMatches: matchData.length,
      lastAnalyzed: new Date(),
    };

    // 파일로 저장
    saveAnalyzedData(analyzedData);

    // 메모리에도 저장 (하위 호환성)
    global.analyzedData = analyzedData;

    console.log(`✓ 분석 완료: 메타 ${metaComps.length}개, 시너지 ${synergyRankings.length}개, 증강 ${augmentRankings.length}개`);

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
      error: "데이터 분석 실패",
      details: error.message,
    });
  }
}
