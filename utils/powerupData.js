// TFT 시즌 15 파워업 데이터 (Set 15: K.O. Coliseum)

export const POWERUPS_DATA = {
  // ========== 공격형 파워업 ==========
  offensive: [
    {
      name: "극대화 공격",
      description: "처치 시마다 영구적으로 공격력을 획득합니다.",
      champions: "공격수, 전사",
    },
    {
      name: "극대화 아르카나",
      description: "처치 시마다 영구적으로 주문력을 획득합니다.",
      champions: "마법사, 주문검사",
    },
    {
      name: "이중 타격",
      description: "공격 시 일정 확률로 추가 공격을 발동합니다.",
      champions: "공격수, 결투가",
    },
    {
      name: "치명적 위협",
      description: "스킬이 치명타를 발동할 수 있습니다. 3초마다 치명타 확률이 5% 증가합니다.",
      champions: "암살자, 결투가",
    },
    {
      name: "소멸",
      description: "공격력 증폭을 얻습니다. 첫 처치 후 증폭량이 크게 증가합니다.",
      champions: "전사, 암살자",
    },
    {
      name: "과다출혈",
      description: "스킬이 시간에 걸쳐 추가 출혈 피해를 입힙니다.",
      champions: "전사, 결투가",
    },
    {
      name: "예술적 K.O.",
      description: "4번째 공격마다 추가 피해를 입힙니다.",
      champions: "공격수, 전사",
    },
    {
      name: "총알 지옥",
      description: "스킬로 더 많은 투사체를 발사합니다.",
      champions: "공격수, 저격수",
    },
    {
      name: "모자 트릭",
      description: "공격력과 주문력을 얻습니다. 처치 시마다 모자를 쌓아 추가 스탯을 얻습니다.",
      champions: "하이브리드",
    },
    {
      name: "추격",
      description: "스킬 시전 시 돌진하고 추가 총알을 발사합니다.",
      champions: "루시안",
    },
  ],

  // ========== 방어형 파워업 ==========
  defensive: [
    {
      name: "100번의 팔굽혀펴기",
      description: "방어력을 얻습니다. 상점 새로고침 시마다 영구적인 공격력 증폭을 얻습니다.",
      champions: "탱커, 전사",
    },
    {
      name: "적응형 피부",
      description: "피해를 받으면 피해 유형에 따라 방어력 또는 마법 저항력을 얻습니다. 최대 50까지 중첩됩니다.",
      champions: "탱커, 루카도르",
    },
    {
      name: "부식성",
      description: "2칸 내의 적을 30% 방어 관통하고 마법 관통합니다. 방어 관통된 적에게서 받는 피해가 10% 감소합니다.",
      champions: "탱커, 전사",
    },
    {
      name: "거인화",
      description: "2개의 유닛 칸을 차지합니다. 체력, 방어력, 공격력 증폭을 대폭 얻습니다.",
      champions: "모든 챔피언",
    },
    {
      name: "저항성",
      description: "받는 각각의 피해 인스턴스를 감소시킵니다.",
      champions: "탱커",
    },
    {
      name: "순수한 마음",
      description: "주기적으로 자신과 주변 아군을 치유합니다.",
      champions: "서포터, 탱커",
    },
    {
      name: "가시 껍질",
      description: "공격하는 적에게 피해를 반사합니다.",
      champions: "탱커",
    },
    {
      name: "살아있는 벽",
      description: "방어력과 마법 저항력을 제공하며, 공격 속도를 부여합니다.",
      champions: "탱커, 서포터",
    },
  ],

  // ========== 성장형 파워업 ==========
  growth: [
    {
      name: "9,000 초과",
      description: "매 라운드마다 무작위 영구 스탯 보너스를 얻습니다.",
      champions: "모든 챔피언",
    },
    {
      name: "영웅의 궤적",
      description: "플레이어 레벨에 비례하여 공격력 증폭이 증가합니다.",
      champions: "캐리 챔피언",
    },
    {
      name: "최종 형태",
      description: "특정 라운드에 3성이 4성으로 승급합니다.",
      champions: "저코스트",
    },
    {
      name: "최대 체력",
      description: "몇 초마다 영구적인 체력을 얻습니다.",
      champions: "탱커, 전사",
    },
    {
      name: "극대화 속도",
      description: "처치 시마다 영구적으로 공격 속도를 획득합니다.",
      champions: "공격수",
    },
    {
      name: "힘 모으기",
      description: "마나를 소비할 때마다 공격력이 중첩됩니다.",
      champions: "마법사",
    },
    {
      name: "미다스의 손",
      description: "기본 공격이 체력이 낮은 적을 처형하고 골드를 획득합니다.",
      champions: "공격수",
    },
    {
      name: "황금 장갑",
      description: "수집한 골드를 영구 공격력으로 전환합니다.",
      champions: "공격수",
    },
  ],

  // ========== 유틸리티 파워업 ==========
  utility: [
    {
      name: "그림자 분신",
      description: "이 챔피언의 완벽한 복사본을 생성하여 일정 비율의 피해를 입힙니다.",
      champions: "모든 챔피언",
    },
    {
      name: "요정 꼬리",
      description: "스킬 시전 시 8초에 걸쳐 피해를 입히는 요정 2마리를 소환합니다.",
      champions: "마법사",
    },
    {
      name: "융합의 춤",
      description: "가장 가까운 아군과 융합하여 스탯의 일부를 획득합니다.",
      champions: "모든 챔피언",
    },
    {
      name: "마나 돌진",
      description: "마나 비용을 줄이고 피해량과 주문력을 얻습니다.",
      champions: "마법사",
    },
    {
      name: "본질 공유",
      description: "소비한 마나를 기반으로 아군에게 마나를 부여합니다.",
      champions: "서포터",
    },
    {
      name: "효율성",
      description: "최대 마나를 감소시킵니다.",
      champions: "마법사",
    },
    {
      name: "마법사",
      description: "스킬을 두 번 시전하지만 피해가 감소합니다.",
      champions: "마법사",
    },
    {
      name: "순간 이동 공격",
      description: "대상을 바꿀 때 다음 대상으로 순간이동합니다.",
      champions: "암살자",
    },
    {
      name: "가출 감독",
      description: "가장 낮은 체력의 아군에게 보호막을 부여합니다.",
      champions: "서포터",
    },
    {
      name: "라운드 2",
      description: "사망 시 훈련 더미를 소환합니다.",
      champions: "모든 챔피언",
    },
  ],

  // ========== 특수 파워업 ==========
  special: [
    {
      name: "끝판왕",
      description: "흡혈과 공격력 증폭을 얻습니다. 아군이 사망할 때마다 증가합니다.",
      champions: "캐리 챔피언",
    },
    {
      name: "최종 등정",
      description: "여러 단계의 상승을 거쳐 중첩 보너스를 얻습니다.",
      champions: "성장형 챔피언",
    },
    {
      name: "결승 진출자",
      description: "제거된 플레이어당 공격력 증폭이 증가합니다.",
      champions: "후반 캐리",
    },
    {
      name: "타이탄",
      description: "체력이 증가하고 전장을 발로 밟아 적을 띄웁니다.",
      champions: "탱커",
    },
    {
      name: "원자력",
      description: "체력을 저장하여 사망 시 마법 피해를 입힙니다.",
      champions: "탱커",
    },
    {
      name: "손전등",
      description: "전투 시작 시 반대편 적을 제거하는 회오리를 생성합니다.",
      champions: "유틸리티",
    },
    {
      name: "체인지",
      description: "전투 시작 시 가장 가까운 아군으로 변신합니다.",
      champions: "특수 챔피언",
    },
    {
      name: "부패",
      description: "휴면 상태로 시작하며, 체력이 낮아지면 각성하여 적을 기절시킵니다.",
      champions: "탱커",
    },
    {
      name: "특이점",
      description: "육각형 특이점이 되어 주기적으로 마법 피해를 입힙니다.",
      champions: "마법사",
    },
    {
      name: "웨이트",
      description: "10개의 웨이트를 얻습니다. 1개 이상일 때 이동과 공격이 50% 느려집니다. 승리 시 1개, 패배 시 2개씩 떨어집니다.",
      champions: "성장형 챔피언",
    },
  ],
};
