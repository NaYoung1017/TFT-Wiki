// TFT 시즌 15 아이템 정보

// 기본 아이템 (Components)
export const BASIC_ITEMS = {
  BF_SWORD: {
    name: "B.F. 대검",
    key: "BF_SWORD",
    effect: "공격력 +10"
  },
  RECURVE_BOW: {
    name: "곡궁",
    key: "RECURVE_BOW",
    effect: "공격 속도 +10%"
  },
  NEEDLESSLY_LARGE_ROD: {
    name: "쓸데없이 큰 지팡이",
    key: "NEEDLESSLY_LARGE_ROD",
    effect: "주문력 +10"
  },
  NEGATRON_CLOAK: {
    name: "음전자 망토",
    key: "NEGATRON_CLOAK",
    effect: "마법 저항력 +20"
  },
  CHAIN_VEST: {
    name: "쇠사슬 조끼",
    key: "CHAIN_VEST",
    effect: "방어력 +20"
  },
  GIANTS_BELT: {
    name: "거인의 허리띠",
    key: "GIANTS_BELT",
    effect: "체력 +150"
  },
  TEAR_OF_THE_GODDESS: {
    name: "여신의 눈물",
    key: "TEAR_OF_THE_GODDESS",
    effect: "마나 +15"
  },
  SPARRING_GLOVES: {
    name: "연습용 장갑",
    key: "SPARRING_GLOVES",
    effect: "치명타 확률 +20%, 회피 +20%"
  },
  SPATULA: {
    name: "뒤집개",
    key: "SPATULA",
    effect: "특성 상징 조합용"
  }
};

// 완성 아이템 (Completed Items)
export const COMPLETED_ITEMS = {
  // B.F. 대검 조합
  DEATHBLADE: {
    name: "죽음의 검",
    components: ["BF_SWORD", "BF_SWORD"],
    effect: "공격력 +55%. 챔피언 처치 시 공격력 +7% (최대 5중첩)",
    image: "/images/items/TFT_Item_Deathblade.png",
    stats: { avgPlace: "3.8", pickRate: "15.2%", winRate: "32.5%" }
  },
  INFINITY_EDGE: {
    name: "무한의 대검",
    components: ["BF_SWORD", "SPARRING_GLOVES"],
    effect: "치명타 확률 +35%, 공격력 +35%. 스킬이 치명타로 적중할 수 있습니다.",
    image: "/images/items/TFT_Item_InfinityEdge.png",
    stats: { avgPlace: "3.7", pickRate: "18.5%", winRate: "35.2%" }
  },
  GIANT_SLAYER: {
    name: "거인 학살자",
    components: ["BF_SWORD", "RECURVE_BOW"],
    effect: "공격력 +10%, 공격 속도 +10%. 최대 체력이 1750 이상인 적에게 피해량 +30%",
    image: "/images/items/TFT_Item_MadredsBloodrazor.png",
    stats: { avgPlace: "4.0", pickRate: "12.3%", winRate: "28.7%" }
  },
  HEXTECH_GUNBLADE: {
    name: "마법공학 총검",
    components: ["BF_SWORD", "NEEDLESSLY_LARGE_ROD"],
    effect: "공격력 +10, 주문력 +10. 피해를 입히면 피해량의 20%만큼 회복",
    image: "/images/items/TFT_Item_HextechGunblade.png",
    stats: { avgPlace: "4.1", pickRate: "10.8%", winRate: "27.3%" }
  },
  BLOODTHIRSTER: {
    name: "피바라기",
    components: ["BF_SWORD", "NEGATRON_CLOAK"],
    effect: "공격력 +10, 마법 저항력 +20. 최대 체력의 25% 보호막 획득",
    image: "/images/items/TFT_Item_Bloodthirster.png",
    stats: { avgPlace: "4.2", pickRate: "9.5%", winRate: "26.8%" }
  },
  EDGE_OF_NIGHT: {
    name: "밤의 끝자락",
    components: ["BF_SWORD", "CHAIN_VEST"],
    effect: "공격력 +10, 방어력 +20. 전투 시작 시 군중 제어 면역 (18초)",
    image: "/images/items/TFT_Item_BansheesVeil.png",
    stats: { avgPlace: "3.9", pickRate: "13.7%", winRate: "30.5%" }
  },
  STERAK_GAGE: {
    name: "스테락의 도전",
    components: ["BF_SWORD", "GIANTS_BELT"],
    effect: "공격력 +10, 체력 +150. 체력 60% 이하 시 8초간 공격력 +35%",
    image: "/images/items/TFT_Item_SteraksGage.png",
    stats: { avgPlace: "4.0", pickRate: "11.2%", winRate: "29.1%" }
  },
  BLUE_BUFF: {
    name: "푸른 파수꾼",
    components: ["BF_SWORD", "TEAR_OF_THE_GODDESS"],
    effect: "공격력 +10, 마나 +15. 스킬 사용 시 마나 +10",
    image: "/images/items/TFT_Item_BlueBuff.png",
    stats: { avgPlace: "3.8", pickRate: "14.6%", winRate: "31.8%" }
  },

  // 곡궁 조합
  GUINSOO_RAGEBLADE: {
    name: "구인수의 격노검",
    components: ["RECURVE_BOW", "NEEDLESSLY_LARGE_ROD"],
    effect: "공격 속도 +10%, 주문력 +10. 공격할 때마다 공격 속도 +6%",
    image: "/images/items/TFT_Item_GuinsoosRageblade.png",
    stats: { avgPlace: "3.7", pickRate: "16.8%", winRate: "33.7%" }
  },
  RUNAAN_HURRICANE: {
    name: "루난의 허리케인",
    components: ["RECURVE_BOW", "NEGATRON_CLOAK"],
    effect: "공격 속도 +10%, 마법 저항력 +20. 공격 시 추가 화살 2개 발사",
    image: "/images/items/TFT_Item_RunaansHurricane.png",
    stats: { avgPlace: "3.9", pickRate: "13.9%", winRate: "30.8%" }
  },
  STATIKK_SHIV: {
    name: "스태틱 단검",
    components: ["RECURVE_BOW", "TEAR_OF_THE_GODDESS"],
    effect: "공격 속도 +10%, 마나 +15. 3번째 공격마다 4명에게 번개 발사",
    image: "/images/items/TFT_Item_StatikkShiv.png",
    stats: { avgPlace: "3.8", pickRate: "15.1%", winRate: "32.3%" }
  },
  TITAN_RESOLVE: {
    name: "티탄의 결의",
    components: ["RECURVE_BOW", "CHAIN_VEST"],
    effect: "공격 속도 +10%, 방어력 +20. 공격 시 방어력/마법 저항력 +2 (최대 25중첩)",
    image: "/images/items/TFT_Item_TitansResolve.png",
    stats: { avgPlace: "4.0", pickRate: "12.5%", winRate: "28.9%" }
  },
  NASHORS_TOOTH: {
    name: "내셔의 이빨",
    components: ["RECURVE_BOW", "GIANTS_BELT"],
    effect: "공격 속도 +10%, 체력 +150. 공격 시 마나 +5",
    image: "/images/items/TFT_Item_NightHarvester.png",
    stats: { avgPlace: "3.9", pickRate: "13.3%", winRate: "30.2%" }
  },
  LAST_WHISPER: {
    name: "최후의 속삭임",
    components: ["RECURVE_BOW", "SPARRING_GLOVES"],
    effect: "공격 속도 +30%, 치명타 확률 +30%. 방어력 및 마법 저항력 무시 +30%",
    image: "/images/items/TFT_Item_LastWhisper.png",
    stats: { avgPlace: "3.8", pickRate: "14.8%", winRate: "31.5%" }
  },
  RAPID_FIRECANNON: {
    name: "고속 연사포",
    components: ["RECURVE_BOW", "RECURVE_BOW"],
    effect: "공격 속도 +30%. 사거리 +1칸. 공격 시 70의 추가 피해",
    image: "/images/items/TFT_Item_RapidFireCannon.png",
    stats: { avgPlace: "4.1", pickRate: "10.9%", winRate: "27.6%" }
  },

  // 쓸데없이 큰 지팡이 조합
  RABADON_DEATHCAP: {
    name: "라바돈의 죽음모자",
    components: ["NEEDLESSLY_LARGE_ROD", "NEEDLESSLY_LARGE_ROD"],
    effect: "주문력 +50. 스킬로 입히는 피해 +15%",
    image: "/images/items/TFT_Item_RabadonsDeathcap.png",
    stats: { avgPlace: "3.6", pickRate: "19.2%", winRate: "36.8%" }
  },
  IONIC_SPARK: {
    name: "이온 충격기",
    components: ["NEEDLESSLY_LARGE_ROD", "NEGATRON_CLOAK"],
    effect: "주문력 +10, 마법 저항력 +20. 적이 스킬 사용 시 최대 마나의 225% 마법 피해",
    image: "/images/items/TFT_Item_IonicSpark.png",
    stats: { avgPlace: "4.0", pickRate: "11.7%", winRate: "29.3%" }
  },
  MORELLONOMICON: {
    name: "모렐로노미콘",
    components: ["NEEDLESSLY_LARGE_ROD", "GIANTS_BELT"],
    effect: "주문력 +10, 체력 +150. 스킬로 10초간 화상 부여 (매초 1% 최대 체력 피해)",
    image: "/images/items/TFT_Item_Morellonomicon.png",
    stats: { avgPlace: "3.8", pickRate: "14.9%", winRate: "31.7%" }
  },
  ARCHANGEL_STAFF: {
    name: "대천사의 지팡이",
    components: ["NEEDLESSLY_LARGE_ROD", "TEAR_OF_THE_GODDESS"],
    effect: "주문력 +10, 마나 +15. 스킬 사용 시 주문력 +20 (5초간)",
    image: "/images/items/TFT_Item_ArchangelsStaff.png",
    stats: { avgPlace: "3.7", pickRate: "17.3%", winRate: "34.2%" }
  },
  JEWELED_GAUNTLET: {
    name: "보석 장갑",
    components: ["NEEDLESSLY_LARGE_ROD", "SPARRING_GLOVES"],
    effect: "주문력 +35, 치명타 확률 +30%. 스킬이 치명타로 적중 가능",
    image: "/images/items/TFT_Item_JeweledGauntlet.png",
    stats: { avgPlace: "3.8", pickRate: "15.5%", winRate: "32.8%" }
  },
  ADAPTIVE_HELM: {
    name: "적응형 투구",
    components: ["NEEDLESSLY_LARGE_ROD", "CHAIN_VEST"],
    effect: "주문력 +10, 방어력 +20. 스킬 사용 시 피해량 +5% (최대 5중첩)",
    image: "/images/items/TFT_Item_AdaptiveHelm.png",
    stats: { avgPlace: "3.9", pickRate: "13.2%", winRate: "30.4%" }
  },

  // 음전자 망토 조합
  DRAGON_CLAW: {
    name: "용의 발톱",
    components: ["NEGATRON_CLOAK", "NEGATRON_CLOAK"],
    effect: "마법 저항력 +75. 매초 최대 체력의 2.5% 회복",
    image: "/images/items/TFT_Item_DragonsClaw.png",
    stats: { avgPlace: "4.1", pickRate: "10.6%", winRate: "27.8%" }
  },
  GARGOYLE_STONEPLATE: {
    name: "가고일 돌갑옷",
    components: ["NEGATRON_CLOAK", "CHAIN_VEST"],
    effect: "방어력 +20, 마법 저항력 +20. 전투 시작 시 인접 적 1명당 방어력/마법 저항력 +18",
    image: "/images/items/TFT_Item_GargoyleStoneplate.png",
    stats: { avgPlace: "3.9", pickRate: "13.8%", winRate: "30.6%" }
  },
  BANSHEE_CLAW: {
    name: "밴시의 발톱",
    components: ["NEGATRON_CLOAK", "TEAR_OF_THE_GODDESS"],
    effect: "마법 저항력 +20, 마나 +15. 전투 시작 시 군중 제어 및 최대 체력의 600 마법 피해 차단",
    image: "/images/items/TFT_Item_BansheesVeil.png",
    stats: { avgPlace: "4.0", pickRate: "12.1%", winRate: "29.0%" }
  },
  QUICKSILVER: {
    name: "수은",
    components: ["NEGATRON_CLOAK", "SPARRING_GLOVES"],
    effect: "마법 저항력 +20, 치명타 확률 +20%, 회피 +20%. 군중 제어 면역",
    image: "/images/items/TFT_Item_Quicksilver.png",
    stats: { avgPlace: "3.8", pickRate: "14.3%", winRate: "31.2%" }
  },
  PROTECTOR_VOW: {
    name: "수호자의 맹세",
    components: ["NEGATRON_CLOAK", "GIANTS_BELT"],
    effect: "마법 저항력 +20, 체력 +150. 전투 시작 시 1칸 내 아군에게 최대 체력의 25% 보호막 부여 (30초)",
    image: "/images/items/TFT_Item_SupportKnightsVow.png",
    stats: { avgPlace: "4.0", pickRate: "11.9%", winRate: "29.5%" }
  },

  // 쇠사슬 조끼 조합
  BRAMBLE_VEST: {
    name: "덤불 조끼",
    components: ["CHAIN_VEST", "CHAIN_VEST"],
    effect: "방어력 +65. 피격 시 공격자에게 100의 마법 피해",
    image: "/images/items/TFT_Item_BrambleVest.png",
    stats: { avgPlace: "4.1", pickRate: "10.4%", winRate: "27.5%" }
  },
  SUNFIRE_CAPE: {
    name: "태양불꽃 망토",
    components: ["CHAIN_VEST", "GIANTS_BELT"],
    effect: "방어력 +20, 체력 +150. 매 2초마다 2칸 내 적들에게 10초간 화상 부여",
    image: "/images/items/TFT_Item_RedBuff.png",
    stats: { avgPlace: "3.9", pickRate: "13.5%", winRate: "30.7%" }
  },
  SHROUD_OF_STILLNESS: {
    name: "고요함의 장막",
    components: ["CHAIN_VEST", "SPARRING_GLOVES"],
    effect: "방어력 +20, 치명타 확률 +20%, 회피 +20%. 전투 시작 시 2칸 내 적의 마나 40% 감소",
    image: "/images/items/TFT_Item_Shroud.png",
    stats: { avgPlace: "3.8", pickRate: "14.7%", winRate: "31.9%" }
  },
  FROZEN_HEART: {
    name: "얼어붙은 심장",
    components: ["CHAIN_VEST", "TEAR_OF_THE_GODDESS"],
    effect: "방어력 +20, 마나 +15. 2칸 내 적의 공격 속도 -25%",
    image: "/images/items/TFT_Item_FrozenHeart.png",
    stats: { avgPlace: "3.9", pickRate: "13.6%", winRate: "30.5%" }
  },

  // 거인의 허리띠 조합
  WARMOG_ARMOR: {
    name: "워모그의 갑옷",
    components: ["GIANTS_BELT", "GIANTS_BELT"],
    effect: "체력 +500. 5초간 피해를 받지 않으면 매초 최대 체력의 6% 회복",
    image: "/images/items/TFT_Item_WarmogsArmor.png",
    stats: { avgPlace: "4.2", pickRate: "9.7%", winRate: "26.5%" }
  },
  REDEMPTION: {
    name: "구원",
    components: ["GIANTS_BELT", "TEAR_OF_THE_GODDESS"],
    effect: "체력 +150, 마나 +15. 전투 시작 7초 후 1칸 내 아군 800 체력 회복",
    image: "/images/items/TFT_Item_Redemption.png",
    stats: { avgPlace: "4.0", pickRate: "11.8%", winRate: "29.2%" }
  },
  TACTICIAN_CROWN: {
    name: "책사의 왕관",
    components: ["GIANTS_BELT", "SPARRING_GLOVES"],
    effect: "체력 +150, 치명타 확률 +20%, 회피 +20%. 소지자의 별 레벨 +1",
    image: "/images/items/TFT_Item_Crownguard.png",
    stats: { avgPlace: "3.6", pickRate: "18.9%", winRate: "35.6%" }
  },

  // 여신의 눈물 조합
  HAND_OF_JUSTICE: {
    name: "정의의 손길",
    components: ["TEAR_OF_THE_GODDESS", "SPARRING_GLOVES"],
    effect: "마나 +15, 치명타 확률 +20%, 회피 +20%. 공격력/주문력 +15% 또는 흡혈 +15% (라운드마다 변경)",
    image: "/images/items/TFT_Item_Chalice.png",
    stats: { avgPlace: "3.8", pickRate: "14.5%", winRate: "31.6%" }
  },
  SPEAR_OF_SHOJIN: {
    name: "쇼진의 창",
    components: ["TEAR_OF_THE_GODDESS", "TEAR_OF_THE_GODDESS"],
    effect: "마나 +30. 공격 시 마나 +5",
    image: "/images/items/TFT_Item_SpearOfShojin.png",
    stats: { avgPlace: "3.7", pickRate: "16.5%", winRate: "33.8%" }
  },

  // 연습용 장갑 조합
  THIEF_GLOVES: {
    name: "도적의 장갑",
    components: ["SPARRING_GLOVES", "SPARRING_GLOVES"],
    effect: "치명타 확률 +40%, 회피 +40%. 라운드마다 임시 아이템 2개 획득 (아이템 장착 불가)",
    image: "/images/items/TFT_Item_ThiefsGloves.png",
    stats: { avgPlace: "3.9", pickRate: "12.8%", winRate: "30.1%" }
  }
};

// 상징 아이템 (뒤집개 조합)
export const EMBLEM_ITEMS = {
  STAR_GUARDIAN_EMBLEM: {
    name: "별 수호자 상징",
    components: ["SPATULA", "TEAR_OF_THE_GODDESS"],
    effect: "별 수호자 특성 획득",
    image: "/images/items/TFT15_Item_StarGuardianEmblemItem.png"
  },
  SOUL_FIGHTER_EMBLEM: {
    name: "소울 파이터 상징",
    components: ["SPATULA", "NEEDLESSLY_LARGE_ROD"],
    effect: "소울 파이터 특성 획득",
    image: "/images/items/TFT15_Item_SoulFighterEmblemItem.png"
  },
  DUELIST_EMBLEM: {
    name: "결투가 상징",
    components: ["SPATULA", "RECURVE_BOW"],
    effect: "결투가 특성 획득",
    image: "/images/items/TFT15_Item_ChallengerEmblemItem.png"
  },
  BASTION_EMBLEM: {
    name: "요새 상징",
    components: ["SPATULA", "CHAIN_VEST"],
    effect: "요새 특성 획득",
    image: "/images/items/TFT15_Item_BastionEmblemItem.png"
  },
  PROTECTOR_EMBLEM: {
    name: "봉쇄자 상징",
    components: ["SPATULA", "NEGATRON_CLOAK"],
    effect: "봉쇄자 특성 획득",
    image: "/images/items/TFT15_Item_ProtectorEmblemItem.png"
  },
  HEAVYWEIGHT_EMBLEM: {
    name: "헤비급 상징",
    components: ["SPATULA", "GIANTS_BELT"],
    effect: "헤비급 특성 획득",
    image: "/images/items/TFT15_Item_HeavyweightEmblemItem.png"
  },
  EXECUTIONER_EMBLEM: {
    name: "처형자 상징",
    components: ["SPATULA", "SPARRING_GLOVES"],
    effect: "처형자 특성 획득",
    image: "/images/items/TFT15_Item_SniperEmblemItem.png"
  },
  MAGE_EMBLEM: {
    name: "마법사 상징",
    components: ["SPATULA", "BF_SWORD"],
    effect: "마법사 특성 획득",
    image: "/images/items/TFT15_Item_SpellslingerEmblemItem.png"
  },
  TACTICIAN_EMBLEM: {
    name: "책사 상징",
    components: ["SPATULA", "SPATULA"],
    effect: "랜덤 상징 획득",
    image: "/images/items/TFT15_Item_ShotcallerEmblemItem.png"
  }
};

// 아이템 조합 테이블
export function getItemCombination(component1, component2) {
  // 모든 완성 아이템을 순회하면서 조합 찾기
  for (const [key, item] of Object.entries(COMPLETED_ITEMS)) {
    if (
      (item.components[0] === component1 && item.components[1] === component2) ||
      (item.components[0] === component2 && item.components[1] === component1)
    ) {
      return { key, ...item };
    }
  }

  // 상징 아이템 확인
  for (const [key, item] of Object.entries(EMBLEM_ITEMS)) {
    if (
      (item.components[0] === component1 && item.components[1] === component2) ||
      (item.components[0] === component2 && item.components[1] === component1)
    ) {
      return { key, ...item };
    }
  }

  return null;
}

// 기본 아이템 배열
export const BASIC_ITEMS_ARRAY = Object.keys(BASIC_ITEMS);
