// TFT 시즌 15 시너지 정보 (공식 한글 번역)

export const SYNERGY_INFO = {
  Arcana: {
    name: "비전술사",
    description: "비전술사가 스킬을 시전하면 팀이 특별한 효과를 얻습니다.",
    tiers: [
      { count: 2, effect: "2초간 10의 마나 재생" },
      { count: 3, effect: "3초간 15의 마나 재생" },
      { count: 4, effect: "4초간 20의 마나 재생" },
      { count: 5, effect: "5초간 30의 마나 재생" }
    ],
    champions: ["Ahri", "Cassiopeia", "Hwei", "Ryze", "Tahm", "Vex", "Xerath"]
  },
  Bastion: {
    name: "방벽술사",
    description: "방벽술사는 방어력과 마법 저항력을 얻습니다.",
    tiers: [
      { count: 2, effect: "20의 방어력과 마법 저항력" },
      { count: 4, effect: "50의 방어력과 마법 저항력" },
      { count: 6, effect: "90의 방어력과 마법 저항력" },
      { count: 8, effect: "200의 방어력과 마법 저항력" }
    ],
    champions: ["Jax", "Kassadin", "Milio", "Nunu", "Poppy", "Rumble", "Swain", "Taric"]
  },
  Bat: {
    name: "박쥐여왕",
    description: "박쥐가 적을 물어뜯어 체력을 흡수합니다.",
    tiers: [
      { count: 1, effect: "유일 시너지" }
    ],
    champions: ["Briar"]
  },
  Bee: {
    name: "벌",
    description: "전투 시작 시 꿀을 생성합니다. 벌은 공격 시 추가 피해를 입힙니다.",
    tiers: [
      { count: 1, effect: "유일 시너지" }
    ],
    champions: ["Norra"]
  },
  Blaster: {
    name: "화염술사",
    description: "화염술사는 스킬로 추가 피해를 입힙니다.",
    tiers: [
      { count: 2, effect: "스킬 피해량 30% 증가" },
      { count: 4, effect: "스킬 피해량 75% 증가" },
      { count: 6, effect: "스킬 피해량 120% 증가" }
    ],
    champions: ["Akali", "Jinx", "Kog", "Rumble", "Tristana", "Ziggs"]
  },
  Chrono: {
    name: "시공술사",
    description: "전투 시작 시 속도가 빨라집니다.",
    tiers: [
      { count: 2, effect: "8초간 15% 공격 속도" },
      { count: 4, effect: "8초간 35% 공격 속도" },
      { count: 6, effect: "8초간 70% 공격 속도" }
    ],
    champions: ["Blitzcrank", "Camille", "Fiora", "Gwen", "Jinx", "Zilean"]
  },
  Dragon: {
    name: "용",
    description: "용은 강력한 능력을 가지고 있습니다.",
    tiers: [
      { count: 2, effect: "용의 체력 30% 증가" },
      { count: 3, effect: "용의 체력 80% 증가" }
    ],
    champions: ["Nomsy", "Shyvana", "Smolder"]
  },
  Eldritch: {
    name: "광기술사",
    description: "광기술사가 죽으면 공포를 퍼뜨립니다.",
    tiers: [
      { count: 3, effect: "2초간 공포" },
      { count: 5, effect: "3초간 공포" },
      { count: 7, effect: "5초간 공포" },
      { count: 10, effect: "8초간 공포" }
    ],
    champions: ["Bard", "Cassiopeia", "Elise", "Galio", "Nasus", "Nilah", "Nunu", "Swain", "Vex", "Wukong"]
  },
  Faerie: {
    name: "요정",
    description: "요정은 처치 시 여왕에게 아이템을 줍니다.",
    tiers: [
      { count: 3, effect: "1개의 아이템 생성" },
      { count: 5, effect: "2개의 아이템 생성" },
      { count: 7, effect: "4개의 아이템 생성" },
      { count: 9, effect: "6개의 아이템 생성" }
    ],
    champions: ["Akali", "Bard", "Hwei", "Kalista", "Katarina", "Lillia", "Rakan", "Seraphine", "Tristana"]
  },
  Frost: {
    name: "서리술사",
    description: "서리술사는 적을 얼립니다.",
    tiers: [
      { count: 3, effect: "2초간 빙결" },
      { count: 5, effect: "3초간 빙결" },
      { count: 7, effect: "4초간 빙결" },
      { count: 9, effect: "6초간 빙결" }
    ],
    champions: ["Diana", "Nunu", "Twitch", "Warwick", "Zilean"]
  },
  Honeymancy: {
    name: "벌꿀술사",
    description: "벌꿀술사는 체력을 회복합니다.",
    tiers: [
      { count: 3, effect: "매 초마다 2%의 체력 회복" },
      { count: 5, effect: "매 초마다 5%의 체력 회복" },
      { count: 7, effect: "매 초마다 10%의 체력 회복" }
    ],
    champions: ["Bard", "Blitzcrank", "Nunu", "Rumble", "Seraphine", "Soraka", "Zilean"]
  },
  Hunter: {
    name: "사냥꾼",
    description: "사냥꾼은 처치 시 추가 피해를 입힙니다.",
    tiers: [
      { count: 2, effect: "10%의 추가 피해" },
      { count: 4, effect: "30%의 추가 피해" },
      { count: 6, effect: "60%의 추가 피해" }
    ],
    champions: ["Ashe", "Briar", "Ezreal", "Nilah", "Nomsy", "Twitch", "Warwick"]
  },
  Mage: {
    name: "마법사",
    description: "마법사는 스킬 2회 시전합니다.",
    tiers: [
      { count: 3, effect: "스킬 2회 시전" },
      { count: 5, effect: "스킬 3회 시전, 25 주문력" },
      { count: 7, effect: "스킬 4회 시전, 50 주문력" },
      { count: 9, effect: "스킬 5회 시전, 80 주문력" }
    ],
    champions: ["Ahri", "Nami", "Norra", "Ryze", "Seraphine", "Syndra", "Veigar", "Vex", "Xerath"]
  },
  Multistriker: {
    name: "연속공격",
    description: "연속공격은 공격 속도가 빠릅니다.",
    tiers: [
      { count: 3, effect: "매 3회 공격마다 2회 추가 공격" },
      { count: 5, effect: "매 3회 공격마다 3회 추가 공격" },
      { count: 7, effect: "매 3회 공격마다 4회 추가 공격" },
      { count: 9, effect: "매 3회 공격마다 6회 추가 공격" }
    ],
    champions: ["Ashe", "Gwen", "Lillia", "Shen", "Shyvana"]
  },
  Portal: {
    name: "차원문",
    description: "차원문이 열려 보상을 제공합니다.",
    tiers: [
      { count: 3, effect: "1개의 보상" },
      { count: 6, effect: "2개의 보상" },
      { count: 8, effect: "4개의 보상" },
      { count: 10, effect: "6개의 보상" }
    ],
    champions: ["Fiora", "Kassadin", "Milio", "Mordekaiser", "Nami", "Nasus", "Norra", "Taric", "Varus", "Zilean"]
  },
  Preserver: {
    name: "수호자",
    description: "수호자는 아군을 보호합니다.",
    tiers: [
      { count: 2, effect: "10% 피해 감소" },
      { count: 3, effect: "25% 피해 감소" },
      { count: 4, effect: "40% 피해 감소" },
      { count: 5, effect: "65% 피해 감소" }
    ],
    champions: ["Bard", "Camille", "Nami", "Nasus", "Rakan", "Soraka"]
  },
  Pyro: {
    name: "화염술사",
    description: "화염술사는 불타는 피해를 입힙니다.",
    tiers: [
      { count: 2, effect: "3초간 매 초 10%의 최대 체력 피해" },
      { count: 3, effect: "5초간 매 초 15%의 최대 체력 피해" },
      { count: 4, effect: "8초간 매 초 25%의 최대 체력 피해" },
      { count: 5, effect: "99초간 매 초 40%의 최대 체력 피해" }
    ],
    champions: ["Diana", "Jinx", "Mordekaiser", "Rumble", "Smolder", "Ziggs"]
  },
  Scholar: {
    name: "학자",
    description: "학자는 마나를 빠르게 획득합니다.",
    tiers: [
      { count: 2, effect: "매 초마다 2 마나" },
      { count: 4, effect: "매 초마다 5 마나" },
      { count: 6, effect: "매 초마다 10 마나" }
    ],
    champions: ["Ahri", "Bard", "Hwei", "Nami", "Norra", "Ryze", "Syndra", "Xerath"]
  },
  Shapeshifter: {
    name: "변신술사",
    description: "변신술사는 추가 체력을 얻습니다.",
    tiers: [
      { count: 2, effect: "250의 추가 체력" },
      { count: 4, effect: "650의 추가 체력" },
      { count: 6, effect: "1200의 추가 체력" }
    ],
    champions: ["Elise", "Gwen", "Jayce", "Neeko", "Shyvana", "Swain"]
  },
  Sugarcraft: {
    name: "설탕공예사",
    description: "설탕공예사는 체력이 증가합니다.",
    tiers: [
      { count: 2, effect: "15% 체력 증가" },
      { count: 4, effect: "35% 체력 증가" },
      { count: 6, effect: "65% 체력 증가" }
    ],
    champions: ["Jinx", "Katarina", "Lillia", "Nomsy", "Rumble", "Soraka", "Ziggs"]
  },
  Vanguard: {
    name: "선봉대",
    description: "선봉대는 추가 방어력을 얻습니다.",
    tiers: [
      { count: 2, effect: "10% 방어력" },
      { count: 4, effect: "30% 방어력" },
      { count: 6, effect: "75% 방어력" }
    ],
    champions: ["Blitzcrank", "Galio", "Mordekaiser", "Nunu", "Poppy", "Shen", "Wukong"]
  },
  Warrior: {
    name: "전사",
    description: "전사는 공격력과 공격 속도가 증가합니다.",
    tiers: [
      { count: 2, effect: "15% 공격력, 15% 공격 속도" },
      { count: 4, effect: "35% 공격력, 35% 공격 속도" },
      { count: 6, effect: "65% 공격력, 65% 공격 속도" }
    ],
    champions: ["Camille", "Garen", "Jax", "Kalista", "Tristana", "Trundle", "Yasuo"]
  },
  Witchcraft: {
    name: "마녀",
    description: "마녀는 저주로 적을 약화시킵니다.",
    tiers: [
      { count: 2, effect: "적 1명에게 저주" },
      { count: 4, effect: "적 2명에게 저주" },
      { count: 6, effect: "적 3명에게 저주" },
      { count: 8, effect: "모든 적에게 저주" }
    ],
    champions: ["Cassiopeia", "Karma", "Katarina", "Morgana", "Nami", "Syndra", "Vex", "Wukong"]
  }
};

export function getSynergyInfo(synergyName) {
  const cleaned = synergyName
    .replace("TFT15_", "")
    .replace("Set15_", "")
    .replace("TFT_Trait_", "");
  return SYNERGY_INFO[cleaned] || null;
}
