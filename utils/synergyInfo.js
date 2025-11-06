// TFT 시즌 15 시너지 정보 (정확한 데이터)

export const SYNERGY_INFO = {
  // ===== 계열 시너지 =====

  // 별 수호자 (StarGuardian)
  StarGuardian: {
    name: "별 수호자",
    description:
      "별 수호자는 모든 별 수호자에게 부여되는 고유 팀워크 추가 효과를 갖습니다. 배치된 별 수호자마다 추가 효과를 강화합니다!",
    tiers: [
      { count: 3, effect: "팀워크 효과 1단계 활성화" },
      { count: 5, effect: "팀워크 효과 2단계 활성화" },
      { count: 7, effect: "팀워크 효과 3단계 활성화" },
      { count: 9, effect: "팀워크 효과 최대 강화" },
    ],
    champions: [
      "Rell",
      "Syndra",
      "Xayah",
      "Ahri",
      "Neeko",
      "Poppy",
      "Jinx",
      "Seraphine",
    ],
  },

  // 소울 파이터 (SoulFighter)
  SoulFighter: {
    name: "소울 파이터",
    description:
      "전투 시작 시 소울 파이터가 매초 공격력과 주문력을 얻습니다. 8초 후 입힌 피해량의 일부만큼 고정 피해를 추가로 입힙니다.",
    tiers: [
      { count: 2, effect: "체력 +120, 초당 공격력/주문력 +1%, 피해증폭 +10%" },
      {
        count: 4,
        effect: "체력 +240, 초당 공격력/주문력 +2.5%, 피해증폭 +16%",
      },
      { count: 6, effect: "체력 +425, 초당 공격력/주문력 +4%, 피해증폭 +22%" },
      { count: 8, effect: "체력 +600, 초당 공격력/주문력 +4%, 피해증폭 +28%" },
    ],
    champions: [
      "Naafiri",
      "Kalista",
      "Lux",
      "XinZhao",
      "Viego",
      "Samira",
      "Sett",
      "Gwen",
    ],
  },

  // 거대 메크 (SentaiRanger)
  SentaiRanger: {
    name: "거대 메크",
    description:
      "거대 메크 로봇을 획득합니다. 거대 메크가 입힌 피해량의 10%만큼 체력을 회복합니다.",
    tiers: [
      { count: 3, effect: "기본 거대 메크 소환" },
      { count: 5, effect: "거대 메크 1단계 업그레이드" },
      { count: 7, effect: "거대 메크 최종 업그레이드" },
    ],
    champions: [
      "Lucian",
      "Aatrox",
      "Gangplank",
      "Senna",
      "JarvanIV",
      "Karma",
      "Yone",
    ],
  },

  // 악령 (Empyrean)
  Empyrean: {
    name: "악령",
    description:
      "4초마다 그림자 세계가 가장 가까운 적 3명을 공격하여 악령이 입힌 피해량의 일부만큼 마법 피해를 입힙니다.",
    tiers: [
      { count: 2, effect: "악령 피해량의 18% 마법 피해" },
      { count: 4, effect: "악령 피해량의 28% 마법 피해" },
      { count: 6, effect: "악령 피해량의 40% 마법 피해" },
    ],
    champions: ["Zac", "Kayle", "Jhin", "Malzahar", "KSante", "Varus"],
  },

  // 크루 (TheCrew)
  TheCrew: {
    name: "크루",
    description:
      "크루 챔피언이 배치한 크루 멤버 1명당 체력 및 공격 속도를 6% 얻습니다. 3성 크루 챔피언 1명당 추가 효과를 얻습니다.",
    tiers: [
      { count: 2, effect: "크루 멤버당 체력 및 공격 속도 +6%" },
      {
        count: 3,
        effect: "크루 멤버당 체력 및 공격 속도 +6%, 1개 유닛 추가 효과",
      },
      {
        count: 4,
        effect: "크루 멤버당 체력 및 공격 속도 +6%, 2개 유닛 추가 효과",
      },
      {
        count: 5,
        effect: "크루 멤버당 체력 및 공격 속도 +6%, 5명 3성 시 즉시 승리",
      },
    ],
    champions: ["Malphite", "Sivir", "Shen", "Ziggs", "TwistedFate"],
  },

  // 전투사관학교 (BattleAcademia)
  BattleAcademia: {
    name: "전투사관학교",
    description:
      "전투사관학교 챔피언이 스킬을 업그레이드하고 잠재력을 얻습니다. 잠재력은 전투사관학교 챔피언의 스킬을 강화합니다.",
    tiers: [
      { count: 3, effect: "잠재력 +3" },
      { count: 5, effect: "잠재력 +5" },
      { count: 7, effect: "잠재력 +7" },
    ],
    champions: [
      "Garen",
      "Ezreal",
      "Katarina",
      "Rakan",
      "Jayce",
      "Caitlyn",
      "Leona",
      "Yuumi",
    ],
  },

  // 수정 갬빗 (GemForce)
  GemForce: {
    name: "수정 갬빗",
    description:
      "플레이어 대상 전투에서 처치 및 패배 시 보석의 힘을 얻습니다. 3회마다 보상으로 전환하거나 '묻고 두 배로 가'를 활성화할 수 있습니다.",
    tiers: [
      { count: 3, effect: "보석의 힘 획득 시작" },
      { count: 5, effect: "추가 전리품 보상" },
      { count: 7, effect: "체력 +300, 피해 증폭 +15%, 보상 130% 증가" },
    ],
    champions: ["Syndra", "Janna", "Vi", "Swain", "Ashe", "Zyra"],
  },

  // 슈프림 셀 (SupremeCells)
  SupremeCells: {
    name: "슈프림 셀",
    description:
      "슈프림 셀이 피해 증폭을 얻습니다. 슈프림 셀 챔피언이 추가 효과를 얻습니다.",
    tiers: [
      { count: 2, effect: "피해 증폭 +8%" },
      { count: 4, effect: "피해 증폭 +16%, 추가 효과 강화" },
    ],
    champions: ["Darius", "Kennen", "Kaisa", "Akali"],
  },

  // ===== 직업 시너지 =====

  // 결투가 (Duelist)
  Duelist: {
    name: "결투가",
    description:
      "결투가가 기본 공격 시 공격 속도를 얻습니다. 최대 12회까지 중첩됩니다.",
    tiers: [
      { count: 2, effect: "공격당 공격 속도 +4% (최대 48%)" },
      { count: 4, effect: "공격당 공격 속도 +7% (최대 84%)" },
      { count: 6, effect: "공격당 공격 속도 +10% (최대 120%), 피해 감소 +12%" },
    ],
    champions: [
      "Kayle",
      "Gangplank",
      "KaiSa",
      "Viego",
      "Udyr",
      "Ashe",
      "LeeSin",
    ],
  },

  // 처형자 (Destroyer)
  Destroyer: {
    name: "처형자",
    description:
      "처형자가 치명타 확률과 치명타 피해량을 얻습니다. 스킬에도 치명타가 적용될 수 있습니다.",
    tiers: [
      { count: 2, effect: "치명타 확률 +25%, 치명타 피해 +10%" },
      { count: 3, effect: "치명타 확률 +35%, 치명타 피해 +15%" },
      { count: 4, effect: "치명타 확률 +50%, 치명타 피해 +22%" },
      { count: 5, effect: "치명타 확률 +65%, 치명타 피해 +30%" },
    ],
    champions: ["Kalista", "Katarina", "Senna", "Ryze", "Akali", "LeeSin"],
  },

  // 마법사 (Spellslinger)
  Spellslinger: {
    name: "마법사",
    description:
      "마법사가 주문력을 얻으며, 스킬로 적 최대 체력에 비례한 추가 마법 피해를 입힙니다.",
    tiers: [
      { count: 2, effect: "주문력 +15, 최대 체력 피해 +1.5%" },
      { count: 4, effect: "주문력 +35, 최대 체력 피해 +2.5%" },
      { count: 6, effect: "주문력 +60, 최대 체력 피해 +4%" },
      { count: 8, effect: "주문력 +100, 최대 체력 피해 +6%" },
    ],
    champions: ["Lucian", "Kennen", "Lux", "Swain", "Ahri", "Karma", "Gwen"],
  },

  // 봉쇄자 (Protector)
  Protector: {
    name: "봉쇄자",
    description:
      "봉쇄자가 최대 체력에 비례한 보호막을 얻습니다. 아군에게도 보호막을 부여합니다.",
    tiers: [
      { count: 2, effect: "최대 체력의 18% 보호막" },
      { count: 4, effect: "최대 체력의 28% 보호막" },
      { count: 6, effect: "최대 체력의 40% 보호막" },
    ],
    champions: ["Kennen", "Malphite", "Janna", "Rakan", "Neeko", "KSante"],
  },

  // 요새 (Bastion)
  Bastion: {
    name: "요새",
    description:
      "아군이 방어력과 마법 저항력을 얻습니다. 요새는 더 많이 얻으며 초반 10초간 2배 효과를 받습니다.",
    tiers: [
      { count: 2, effect: "전체 +10, 요새 추가 +8 방어력/마법 저항력" },
      { count: 4, effect: "전체 +10, 요새 추가 +30 방어력/마법 저항력" },
      {
        count: 6,
        effect: "전체 +10, 요새 추가 +65 방어력/마법 저항력, 비요새 +25 추가",
      },
    ],
    champions: ["Garen", "Rell", "XinZhao", "Shen", "Swain", "Leona", "Braum"],
  },

  // 신동 (Prodigy)
  Prodigy: {
    name: "신동",
    description: "전체 팀이 마나 재생을 얻습니다. 신동은 더 많이 얻습니다.",
    tiers: [
      { count: 2, effect: "전체 +2, 신동 추가 +2 마나 재생" },
      { count: 4, effect: "전체 +2, 신동 추가 +5 마나 재생" },
      { count: 6, effect: "전체 +2, 신동 추가 +10 마나 재생" },
    ],
    champions: ["Ezreal", "Syndra", "Malzahar", "Yuumi", "Seraphine"],
  },

  // 저격수 (Sniper)
  Sniper: {
    name: "저격수",
    description:
      "저격수가 공격 사거리와 피해량을 얻습니다. 거리가 멀수록 피해량이 증가합니다.",
    tiers: [
      { count: 2, effect: "사거리 +1칸, 거리당 피해 +7%" },
      { count: 4, effect: "사거리 +2칸, 거리당 피해 +16%" },
      { count: 6, effect: "사거리 +3칸, 거리당 피해 +28%" },
    ],
    champions: ["Gnar", "Sivir", "Jhin", "Caitlyn", "Jinx", "Varus"],
  },

  // 헤비급 (Heavyweight)
  Heavyweight: {
    name: "헤비급",
    description:
      "전체 팀이 체력 +100을 얻습니다. 헤비급은 추가 체력을 얻고 체력의 일정 비율만큼 공격력을 얻습니다.",
    tiers: [
      {
        count: 2,
        effect: "전체 +100, 헤비급 추가 체력 +10%, 체력의 5% 공격력",
      },
      {
        count: 4,
        effect: "전체 +100, 헤비급 추가 체력 +22%, 체력의 7% 공격력",
      },
      {
        count: 6,
        effect: "전체 +100, 헤비급 추가 체력 +40%, 체력의 10% 공격력",
      },
    ],
    champions: ["Zac", "Aatrox", "Kobuko", "Jayce", "Darius", "Poppy"],
  },

  // 전쟁기계 (Juggernaut)
  Juggernaut: {
    name: "전쟁기계",
    description:
      "전쟁기계가 기본 공격 또는 스킬로 적을 처치하면 해로운 효과를 제거하고 체력을 회복합니다. 체력 50% 이상일 때 피해 감소를 얻습니다.",
    tiers: [
      { count: 2, effect: "15~25% 피해 감소, 처치 시 체력 10% 회복" },
      { count: 4, effect: "20~30% 피해 감소, 처치 시 체력 10% 회복" },
      { count: 6, effect: "25~35% 피해 감소, 처치 시 체력 10% 회복" },
    ],
    champions: ["Aatrox", "Naafiri", "Vi", "DrMundo", "Udyr", "Sett", "LeeSin"],
  },

  // 책략가 (Strategist)
  Strategist: {
    name: "책략가",
    description: "책략가가 주변 아군에게 마나와 추가 효과를 제공합니다.",
    tiers: [
      { count: 2, effect: "주변 아군 마나 +5" },
      { count: 3, effect: "주변 아군 마나 +10" },
      { count: 4, effect: "주변 아군 마나 +15, 추가 효과 강화" },
    ],
    champions: ["Janna", "Ziggs", "Ryze", "JarvanIV"],
  },

  // 이단아 (Edgelord)
  Edgelord: {
    name: "이단아",
    description:
      "이단아가 흡혈과 공격력을 얻습니다. 체력 50% 이하 적 공격 시 공격 속도 +40%를 얻습니다.",
    tiers: [
      { count: 2, effect: "흡혈 +10%, 공격력 +15%" },
      { count: 4, effect: "흡혈 +12%, 공격력 +40%" },
      { count: 6, effect: "흡혈 +15%, 공격력 +60%" },
    ],
    champions: ["Shen", "Xayah", "Yasuo", "Samira", "Volibear", "Yone"],
  },

  // 프로레슬러 (Luchador)
  Luchador: {
    name: "프로레슬러",
    description:
      "체력이 50%일 때, 프로레슬러가 해로운 효과를 제거하고 체력을 회복한 다음, 전투에 다시 뛰어들어 반경 1칸 내 적을 1초 동안 기절시킵니다.",
    tiers: [
      { count: 2, effect: "체력 30% 회복, 1칸 기절" },
      { count: 4, effect: "체력 50% 회복, 1칸 기절, 추가 효과" },
    ],
    champions: ["Gnar", "DrMundo", "Volibear", "Braum"],
  },

  // ===== 유일 특성 =====

  // 태세의 대가 (DragonFist)
  DragonFist: {
    name: "태세의 대가",
    description: "태세의 대가는 전투 스타일을 전환하며 강력한 능력을 얻습니다.",
    tiers: [{ count: 1, effect: "유일 특성 - 전투 스타일 전환" }],
    champions: ["LeeSin"],
  },

  // 해적선장 (Captain)
  Captain: {
    name: "해적선장",
    description: "해적선장이 전투에서 처치하면 금화를 획득합니다.",
    tiers: [{ count: 1, effect: "유일 특성 - 처치 시 1~3 골드 획득" }],
    champions: ["TwistedFate"],
  },

  // 장미 어머니 (Rosemother)
  Rosemother: {
    name: "장미 어머니",
    description: "장미 어머니가 아군을 강화하고 보호합니다.",
    tiers: [{ count: 1, effect: "유일 특성 - 아군 강화 효과" }],
    champions: ["Zyra"],
  },

  // 레슬링 챔피언 (ElTigre)
  ElTigre: {
    name: "레슬링 챔피언",
    description: "레슬링 챔피언이 강력한 그래플 능력을 얻습니다.",
    tiers: [{ count: 1, effect: "유일 특성 - 그래플 기술" }],
    champions: ["Braum"],
  },

  // 괴물 트레이너 (MonsterTrainer)
  MonsterTrainer: {
    name: "괴물 트레이너",
    description: "괴물 트레이너가 동반자를 소환하여 함께 싸웁니다.",
    tiers: [
      { count: 2, effect: "동반자 기본 능력" },
      { count: 3, effect: "동반자 강화" },
      { count: 4, effect: "동반자 최대 강화" },
    ],
    champions: ["Lulu", "Rammus", "Smolder", "KogMaw"],
  },

  // 멘토 (OldMentor)
  OldMentor: {
    name: "멘토",
    description:
      "정확히 1명 또는 4명의 서로 다른 멘토를 배치하면 활성화됩니다. 1명일 때는 아군에게 버프를 주고, 4명일 때는 멘토만 강화됩니다.",
    tiers: [
      { count: 1, effect: "아군 전체에게 멘토별 고유 버프" },
      { count: 4, effect: "멘토 자신만 대폭 강화" },
    ],
    champions: ["Kobuko", "Udyr", "Yasuo", "Ryze"],
  },
};

export function getSynergyInfo(synergyName) {
  if (!synergyName || typeof synergyName !== "string") {
    return null;
  }

  const cleaned = synergyName
    .replace("TFT15_", "")
    .replace("Set15_", "")
    .replace("TFT_Trait_", "");

  return SYNERGY_INFO[cleaned] || null;
}
