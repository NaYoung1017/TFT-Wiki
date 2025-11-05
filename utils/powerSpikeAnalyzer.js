// 덱 파워 스파이크 분석기
import { getChampionCost } from './tftDataLoader';
import { getSynergyInfo } from './synergyInfo';

/**
 * 레벨별 덱 파워 스파이크 계산
 * @param {Array} champions - 챔피언 배열
 * @param {Array} tiers - 시너지 티어 배열
 */
export function analyzePowerSpike(champions, tiers) {
  if (!champions || !tiers) return null;

  const synergyInfo = { champions, tiers };
  const costs = champions.map(champId => getChampionCost(champId));
  const avgCost = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;

  // 레벨별 파워 분석 (3~10레벨만)
  const powerByLevel = [];

  for (let level = 3; level <= 10; level++) {
    const analysis = analyzeLevelPower(level, synergyInfo, costs, avgCost);
    powerByLevel.push(analysis);
  }

  // 시너지 티어별 중요 레벨 찾기
  const importantLevels = new Set();
  synergyInfo.tiers.forEach(tier => {
    // 각 티어를 완성할 수 있는 최소 레벨 (티어 count와 가까운 레벨)
    const minLevel = Math.max(3, Math.min(10, tier.count + 1));
    importantLevels.add(minLevel);
  });

  return {
    levelPowers: powerByLevel.map(lp => ({
      level: lp.level,
      power: lp.power,
      isImportant: importantLevels.has(lp.level)
    }))
  };
}

/**
 * 특정 레벨에서의 파워 계산
 */
function analyzeLevelPower(level, synergyInfo, costs, avgCost) {
  // TFT 레벨별 챔피언 코스트 확률
  const levelOdds = {
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

  const odds = levelOdds[level] || levelOdds[11];

  // 해당 레벨에서 시너지 챔피언을 찾을 수 있는 가중 확률
  let findProbability = 0;
  costs.forEach(cost => {
    findProbability += odds[cost - 1];
  });
  findProbability = findProbability / costs.length;

  // 완성 가능한 티어 계산
  let maxTier = 0;
  let tierPower = 0;

  // 레벨에 따라 필드에 배치 가능한 챔피언 수
  const boardSize = Math.min(level, 9); // 레벨 9까지 1씩 증가

  synergyInfo.tiers.forEach((tier, idx) => {
    if (tier.count <= boardSize) {
      // 해당 티어를 완성할 수 있는 확률
      const completionChance = Math.min(100, findProbability * (boardSize / tier.count));

      if (completionChance > 40) { // 40% 이상이면 완성 가능으로 간주
        maxTier = idx + 1;
        tierPower = (idx + 1) * 30; // 티어당 30 파워
      }
    }
  });

  // 레벨 보너스 (높은 레벨일수록 골드, 경험치 이점)
  const levelBonus = level * 5;

  // 코스트 매칭 보너스 (평균 코스트와 레벨이 잘 맞을 때)
  const idealLevel = avgCost * 2; // 2코 시너지는 4렙, 3코는 6렙 등
  const levelCostMatch = Math.max(0, 100 - Math.abs(level - idealLevel) * 10);

  // 최종 파워 = 티어 파워 + 레벨 보너스 + 매칭 보너스
  const totalPower = tierPower + levelBonus + (levelCostMatch * 0.3);

  return {
    level,
    power: Math.round(totalPower),
    maxTier,
    findProbability: findProbability.toFixed(1),
    boardSize,
    phase: getGamePhase(level)
  };
}

/**
 * 게임 단계 구분
 */
function getGamePhase(level) {
  if (level <= 3) return 'early';
  if (level <= 5) return 'early-mid';
  if (level <= 7) return 'mid';
  if (level <= 8) return 'mid-late';
  return 'late';
}

/**
 * 파워 스파이크 구간 탐지
 */
function detectPowerSpikes(powerByLevel) {
  const spikes = [];

  for (let i = 1; i < powerByLevel.length; i++) {
    const prev = powerByLevel[i - 1];
    const curr = powerByLevel[i];

    // 파워가 크게 상승하는 구간 (20 이상 증가)
    if (curr.power - prev.power >= 20) {
      spikes.push({
        level: curr.level,
        powerIncrease: curr.power - prev.power,
        reason: `${curr.maxTier}티어 완성 가능`,
        type: 'major'
      });
    }
    // 중간 상승 (10 이상)
    else if (curr.power - prev.power >= 10) {
      spikes.push({
        level: curr.level,
        powerIncrease: curr.power - prev.power,
        reason: '챔피언 풀 확률 개선',
        type: 'minor'
      });
    }
  }

  return spikes;
}

/**
 * 약한 구간 탐지
 */
function detectWeakPhases(powerByLevel) {
  const weakPhases = [];
  const avgPower = powerByLevel.reduce((sum, p) => sum + p.power, 0) / powerByLevel.length;

  let weakStart = null;

  powerByLevel.forEach((data, idx) => {
    // 평균보다 20% 이상 낮으면 약한 구간
    if (data.power < avgPower * 0.8) {
      if (weakStart === null) {
        weakStart = idx;
      }
    } else {
      if (weakStart !== null) {
        weakPhases.push({
          startLevel: powerByLevel[weakStart].level,
          endLevel: powerByLevel[idx - 1].level,
          reason: '시너지 미완성 구간'
        });
        weakStart = null;
      }
    }
  });

  // 마지막 구간이 약한 경우
  if (weakStart !== null) {
    weakPhases.push({
      startLevel: powerByLevel[weakStart].level,
      endLevel: powerByLevel[powerByLevel.length - 1].level,
      reason: '시너지 미완성 구간'
    });
  }

  return weakPhases;
}

/**
 * 핵심 레벨 식별
 */
function identifyCriticalLevels(powerByLevel, synergyInfo) {
  const critical = {
    mustReach: [],
    rollLevels: [],
    allIn: null
  };

  // 각 티어가 완성되는 레벨 찾기
  synergyInfo.tiers.forEach((tier, idx) => {
    const levelData = powerByLevel.find(p => p.maxTier === idx + 1 && p.findProbability > 50);
    if (levelData) {
      critical.mustReach.push({
        level: levelData.level,
        tier: idx + 1,
        description: `${tier.count}시너지 완성`
      });
    }
  });

  // 롤해야 하는 레벨 (파워 스파이크 직전)
  powerByLevel.forEach((data, idx) => {
    if (idx > 0 && data.maxTier > powerByLevel[idx - 1].maxTier) {
      critical.rollLevels.push({
        level: data.level,
        description: `${data.maxTier}티어 완성을 위한 롤 타이밍`
      });
    }
  });

  // 올인 레벨 (가장 높은 파워)
  const maxPowerData = powerByLevel.reduce((max, curr) =>
    curr.power > max.power ? curr : max
  , powerByLevel[0]);

  critical.allIn = {
    level: maxPowerData.level,
    power: maxPowerData.power,
    description: '최대 파워 구간'
  };

  return critical;
}

/**
 * 필수 3성 챔피언 분석
 * @param {Array} championIds - 챔피언 ID 배열
 */
export function analyzeThreeStarRequirements(championIds) {
  if (!championIds || championIds.length === 0) return null;

  const champions = championIds.map(champId => ({
    id: champId,
    cost: getChampionCost(champId)
  }));

  // 코스트별 분류
  const lowCost = champions.filter(c => c.cost <= 2);
  const midCost = champions.filter(c => c.cost === 3);
  const highCost = champions.filter(c => c.cost >= 4);

  // 3성 추천
  const recommendations = {
    essential: [], // 필수
    recommended: [], // 권장
    optional: [] // 선택
  };

  // 간단한 추천 리스트 생성
  const allRecommendations = [];

  // 1-2코스트는 3성 권장 (풀이 많아서 가능)
  lowCost.forEach(champ => {
    const goldCost = champ.cost === 1 ? 9 : 18; // 1코 9G, 2코 18G
    allRecommendations.push({
      champion: champ.id,
      priority: champ.cost === 1 ? '높음' : '중간',
      reason: champ.cost === 1
        ? '1코스트 - 3성 달성 용이, 초중반 캐리'
        : '2코스트 - 3성 권장, 중반 파워 상승',
      goldCost: `${goldCost}G`
    });
  });

  // 3코스트 이상은 우선순위 낮음
  [...midCost, ...highCost].slice(0, 2).forEach(champ => {
    const goldCost = champ.cost * champ.cost * 3;
    allRecommendations.push({
      champion: champ.id,
      priority: '낮음',
      reason: `${champ.cost}코스트 - 2성으로 충분, 3성은 선택사항`,
      goldCost: `${goldCost}G`
    });
  });

  return {
    recommendations: allRecommendations.slice(0, 4) // 최대 4개만
  };
}

/**
 * 골드 사용 타이밍 추천
 * @param {Array} champions - 챔피언 배열
 * @param {Array} tiers - 시너지 티어 배열
 */
export function recommendGoldTiming(champions, tiers) {
  if (!champions || !tiers) return null;

  const costs = champions.map(champId => getChampionCost(champId));
  const avgCost = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;

  const stages = [];

  // 평균 코스트 기반 추천
  if (avgCost <= 2) {
    stages.push(
      { stage: '2-1 ~ 3-2', action: '골드 세이브', reason: '이자 쌓기 - 50골드 목표', targetGold: '50G' },
      { stage: '3-5 ~ 4-1', action: '적극 롤', reason: '시너지 완성 및 2성 만들기', targetGold: '30-40G' },
      { stage: '5-1 이후', action: '레벨업 + 롤', reason: '8렙 도달 후 덱 완성', targetGold: '20-30G' }
    );
  } else if (avgCost <= 3) {
    stages.push(
      { stage: '2-1 ~ 4-1', action: '골드 세이브', reason: '이자 확보 - 체력 관리', targetGold: '50G' },
      { stage: '4-2 ~ 5-1', action: '롤다운', reason: '7렙에서 시너지 완성', targetGold: '30G' },
      { stage: '5-5 이후', action: '올인', reason: '8렙 도달 후 전력 투자', targetGold: '0-10G' }
    );
  } else {
    stages.push(
      { stage: '2-1 ~ 4-5', action: '골드 세이브', reason: '최대한 이자 확보', targetGold: '60G' },
      { stage: '5-1 ~ 6-1', action: '레벨업 집중', reason: '8-9렙 빠르게 도달', targetGold: '40G' },
      { stage: '6-1 이후', action: '올인', reason: '고코스트 챔피언 확보', targetGold: '0G' }
    );
  }

  return { stages };
}

/**
 * 전반적인 골드 전략 요약
 */
function getGeneralStrategy(powerSpike) {
  const avgCost = powerSpike.powerByLevel[0].power / 20; // 대략적인 코스트 추정

  if (avgCost <= 1.5) {
    return {
      early: '적극적인 리롤로 1-2코 3성 확보',
      mid: '빠른 8렙 진입',
      late: '고코 추가 후 안정화'
    };
  } else if (avgCost <= 2.5) {
    return {
      early: '자연스러운 강화, 이자 확보',
      mid: '7렙에서 시너지 완성, 8렙 진입',
      late: '8렙에서 덱 완성'
    };
  } else if (avgCost <= 3.5) {
    return {
      early: '체력 관리, 최소 지출',
      mid: '7-8렙에서 안정화',
      late: '9렙에서 완성'
    };
  } else {
    return {
      early: '체력 보존, 골드 적립',
      mid: '이자 최대화',
      late: '8-9렙에서 올인'
    };
  }
}

export default {
  analyzePowerSpike,
  analyzeThreeStarRequirements,
  recommendGoldTiming
};
