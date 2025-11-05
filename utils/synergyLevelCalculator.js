// 시너지 완성 레벨 확률 계산기
import { getChampionCost } from './tftDataLoader';
import { getSynergyInfo } from './synergyInfo';

// TFT 레벨별 챔피언 코스트 확률
const LEVEL_ODDS = {
  1: [100, 0, 0, 0, 0],
  2: [100, 0, 0, 0, 0],
  3: [75, 25, 0, 0, 0],
  4: [55, 30, 15, 0, 0],
  5: [45, 33, 20, 2, 0],
  6: [30, 40, 25, 5, 0],
  7: [19, 30, 35, 15, 1],
  8: [18, 25, 32, 22, 3],
  9: [10, 20, 25, 35, 10],
  10: [5, 10, 20, 40, 25],
  11: [1, 2, 12, 50, 35]
};

// 챔피언 풀 사이즈 (시즌 15 기준)
const CHAMPION_POOL = {
  1: 22, // 1코 챔피언 수 * 풀에 있는 각 챔피언 수
  2: 20,
  3: 17,
  4: 10,
  5: 9
};

// 코스트별 풀 크기
const POOL_SIZE = {
  1: 29, // 각 1코스트 챔피언의 풀에 있는 개수
  2: 22,
  3: 18,
  4: 12,
  5: 10
};

/**
 * 시너지의 챔피언 코스트 분포 계산
 */
function getChampionCostDistribution(synergyInfo) {
  if (!synergyInfo || !synergyInfo.champions) return null;

  const costDistribution = {};
  const champions = synergyInfo.champions;

  champions.forEach(champId => {
    const cost = getChampionCost(champId);
    if (!costDistribution[cost]) {
      costDistribution[cost] = 0;
    }
    costDistribution[cost]++;
  });

  return {
    distribution: costDistribution,
    totalChampions: champions.length,
    avgCost: champions.reduce((sum, champId) => sum + getChampionCost(champId), 0) / champions.length
  };
}

/**
 * 특정 레벨에서 시너지 티어 완성 가능성 계산
 */
function calculateTierCompletion(level, synergyInfo, tierCount) {
  const costDist = getChampionCostDistribution(synergyInfo);
  if (!costDist) return null;

  // 필요한 챔피언 수
  const requiredChampions = tierCount;
  const totalChampions = synergyInfo.champions.length;

  // 해당 레벨에서 각 코스트 챔피언을 얻을 수 있는 평균 확률
  const levelOdds = LEVEL_ODDS[level] || LEVEL_ODDS[11];

  // 각 코스트별로 필요한 챔피언 비율 계산
  let weightedProbability = 0;

  Object.entries(costDist.distribution).forEach(([cost, count]) => {
    const costNum = parseInt(cost);
    // 해당 코스트가 나올 확률
    const costProbability = levelOdds[costNum - 1] / 100;
    // 시너지 내 해당 코스트 챔피언 비율
    const costWeight = count / totalChampions;

    weightedProbability += costProbability * costWeight;
  });

  // 티어 완성을 위해 필요한 챔피언 비율
  const completionRatio = requiredChampions / totalChampions;

  // 최종 확률 계산 (0-100 스케일)
  const completionProbability = Math.min(100, weightedProbability * 100 * (1 / completionRatio));

  return {
    level,
    probability: completionProbability.toFixed(1),
    feasibility: getFeasibilityLevel(completionProbability, costDist.avgCost, level)
  };
}

/**
 * 확률과 평균 코스트 기반 완성 가능성 평가
 */
function getFeasibilityLevel(probability, avgCost, level) {
  // 평균 코스트와 레벨 차이 고려
  const costLevelGap = Math.abs(avgCost - (level / 2));

  if (probability >= 80 && costLevelGap <= 1) return 'very-high';
  if (probability >= 60 && costLevelGap <= 1.5) return 'high';
  if (probability >= 40 && costLevelGap <= 2) return 'medium';
  if (probability >= 20) return 'low';
  return 'very-low';
}

/**
 * 시너지의 모든 티어에 대한 레벨별 완성 확률 계산
 * @param {Array} champions - 챔피언 배열
 * @param {Array} tiers - 시너지 티어 배열
 */
export function calculateSynergyLevelProbabilities(champions, tiers) {
  if (!champions || !tiers) return null;

  // 임시 synergyInfo 객체 생성
  const synergyInfo = { champions, tiers };

  const costInfo = getChampionCostDistribution(synergyInfo);
  const results = [];

  // 각 티어별로 레벨 3-11까지의 완성 확률 계산
  synergyInfo.tiers.forEach(tier => {
    const tierResults = {
      tierCount: tier.count,
      effect: tier.effect,
      levelProbabilities: []
    };

    // 유일 특성 (1개 챔피언만 필요)은 특별 처리
    if (tier.count === 1 && synergyInfo.champions.length === 1) {
      for (let level = 1; level <= 11; level++) {
        const cost = getChampionCost(synergyInfo.champions[0]);
        const levelOdds = LEVEL_ODDS[level] || LEVEL_ODDS[11];
        const probability = levelOdds[cost - 1];

        tierResults.levelProbabilities.push({
          level,
          probability: probability.toFixed(1),
          feasibility: probability >= 30 ? 'high' : (probability >= 15 ? 'medium' : 'low')
        });
      }
    } else {
      // 일반 시너지 계산
      for (let level = 3; level <= 11; level++) {
        const result = calculateTierCompletion(level, synergyInfo, tier.count);
        if (result) {
          tierResults.levelProbabilities.push(result);
        }
      }
    }

    results.push(tierResults);
  });

  // 간단한 형식으로 변환 (모달에서 사용하기 쉽게)
  const simplified = [];

  results.forEach((tierResult, idx) => {
    // 가장 적합한 레벨 찾기 (확률 60% 이상)
    const goodLevel = tierResult.levelProbabilities.find(lp => parseFloat(lp.probability) >= 60);
    const bestLevel = goodLevel || tierResult.levelProbabilities[tierResult.levelProbabilities.length - 1];

    simplified.push({
      level: `${tierResult.tierCount}단계`,
      required: tierResult.tierCount,
      probability: `${bestLevel.probability}% (레벨 ${bestLevel.level})`,
      note: tierResult.effect
    });
  });

  return simplified;
}

/**
 * 시너지 완성을 위한 추천 레벨 계산
 * 최대 티어(모든 시너지 효과)를 달성할 수 있는 레벨 반환
 */
function getRecommendedLevel(tierResults, costInfo) {
  const recommendations = [];

  // 최대 티어 찾기
  const maxTier = tierResults[tierResults.length - 1];

  if (maxTier) {
    // 최대 티어를 60% 이상 확률로 완성할 수 있는 최저 레벨 찾기
    const goodLevel = maxTier.levelProbabilities.find(lp => parseFloat(lp.probability) >= 60);

    if (goodLevel) {
      recommendations.push({
        tier: maxTier.tierCount,
        level: goodLevel.level,
        probability: goodLevel.probability,
        description: `${maxTier.tierCount}명 - 모든 시너지 효과 활성화`
      });
    } else {
      // 60% 이상인 레벨이 없으면 가장 높은 확률의 레벨 추천
      const bestLevel = maxTier.levelProbabilities.reduce((best, current) =>
        parseFloat(current.probability) > parseFloat(best.probability) ? current : best
      );

      recommendations.push({
        tier: maxTier.tierCount,
        level: bestLevel.level,
        probability: bestLevel.probability,
        description: `${maxTier.tierCount}명 - 모든 시너지 효과 활성화 (확률 낮음)`
      });
    }
  }

  return recommendations;
}

/**
 * 코스트 분포 기반 권장 플레이 스타일
 * @param {Array} champions - 챔피언 배열
 * @param {Array} tiers - 시너지 티어 배열
 */
export function getPlayStyleRecommendation(champions, tiers) {
  if (!champions || !tiers) return null;

  const synergyInfo = { champions, tiers };
  const costInfo = getChampionCostDistribution(synergyInfo);
  if (!costInfo) return null;

  const avgCost = costInfo.avgCost;

  if (avgCost <= 1.5) {
    return {
      style: '빠른 8렙 (Fast-8)',
      description: '저코스트 시너지로 빠른 레벨업이 유리합니다',
      tips: [
        '초반부터 시너지를 맞추고 빠르게 8렙을 목표로 플레이하세요',
        '5-6렙에서 시너지 완성 후 경제 확보',
        '8렙 도달 후 고코스트 챔피언으로 업그레이드'
      ]
    };
  } else if (avgCost <= 2.5) {
    return {
      style: '표준 플레이 (Standard)',
      description: '균형잡힌 코스트 분포로 안정적인 플레이가 가능합니다',
      tips: [
        '7렙에서 시너지를 완성하고 8렙에서 고코스트 추가',
        '경제와 체력의 균형을 유지하며 플레이',
        '상황에 따라 유연하게 레벨업 타이밍 조절'
      ]
    };
  } else if (avgCost <= 3.5) {
    return {
      style: '슬로우 롤 (Slow-Roll)',
      description: '중코스트 시너지로 적절한 템포 유지가 필요합니다',
      tips: [
        '7-8렙에서 안정화 후 9렙으로 업그레이드',
        '핵심 챔피언 3성을 노릴 수 있는 구간',
        '체력 관리에 신경쓰며 골드 효율 극대화'
      ]
    };
  } else {
    return {
      style: '후반 지향 (Late-Game)',
      description: '고코스트 시너지로 후반 싸움에 강력합니다',
      tips: [
        '체력을 보존하며 8렙 이상에서 시너지 완성',
        '경제를 최대한 유지하며 느리게 레벨업',
        '9-10렙에서 진가를 발휘하는 빌드'
      ]
    };
  }
}

export default {
  calculateSynergyLevelProbabilities,
  getPlayStyleRecommendation
};
