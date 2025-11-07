// TFT 공식 데이터 로더
import championData from '../public/data/tft-champion.json';
import traitData from '../public/data/tft-trait.json';
import itemData from '../public/data/tft-item.json';
import augmentData from '../public/data/tft-augments.json';

// 챔피언 데이터 맵 생성 (간단한 ID로 접근 가능하게)
const championMap = {};
Object.values(championData.data).forEach(champ => {
  const simpleName = champ.id.replace('TFT15_', '').replace('TFT_', '').toLowerCase();
  championMap[simpleName] = {
    id: champ.id,
    name: champ.name, // 한글 이름
    tier: champ.tier, // 코스트
    image: champ.image.full
  };
});

// 시너지 데이터 맵 생성
const traitMap = {};
Object.values(traitData.data).forEach(trait => {
  const simpleName = trait.id.replace('TFT15_', '').replace('TFT_', '').replace('TFTTutorial_', '');
  traitMap[simpleName] = {
    id: trait.id,
    name: trait.name, // 한글 이름
    image: trait.image.full
  };
});

// 아이템 데이터 맵 생성
const itemMap = {};
Object.values(itemData.data).forEach(item => {
  const simpleName = item.id.replace('TFT_Item_', '').replace('TFT15_', '');
  itemMap[simpleName] = {
    id: item.id,
    name: item.name, // 한글 이름
    image: item.image ? item.image.full : null
  };
});

/**
 * 챔피언 한글 이름 가져오기
 */
export function getChampionName(championId) {
  const champ = championMap[championId.toLowerCase()];
  return champ ? champ.name : championId;
}

/**
 * 챔피언 이미지 경로 가져오기
 */
export function getChampionImage(championId) {
  const champ = championMap[championId.toLowerCase()];
  if (!champ || !champ.image) return null;

  // public/images/champions/ 경로 사용
  // 파일명 형식: TFT15_ChampionName.TFT_Set15.jpg
  return `/images/champions/${champ.image.replace('.png', '.jpg')}`;
}

/**
 * 챔피언 코스트 가져오기
 */
export function getChampionCost(championId) {
  const champ = championMap[championId.toLowerCase()];
  return champ ? champ.tier : 1;
}

/**
 * 시너지 한글 이름 가져오기
 */
export function getTraitName(traitId) {
  const trait = traitMap[traitId];
  return trait ? trait.name : traitId;
}

/**
 * 시너지 아이콘 경로 가져오기
 */
export function getTraitImage(traitId) {
  const trait = traitMap[traitId];
  if (!trait || !trait.image) return null;

  // public/images/traits/ 경로 사용
  return `/images/traits/${trait.image}`;
}

/**
 * 아이템 한글 이름 가져오기
 */
export function getItemName(itemId) {
  // TFT_Item_ prefix 제거
  const simpleName = itemId.replace('TFT_Item_', '').replace('TFT15_', '');
  const item = itemMap[simpleName];
  return item ? item.name : itemId;
}

/**
 * 아이템 이미지 경로 가져오기
 */
export function getItemImage(itemId) {
  const item = itemMap[itemId];
  if (!item || !item.image) return null;

  // public/images/items/ 경로 사용
  return `/images/items/${item.image}`;
}

/**
 * 증강 한글 이름 가져오기
 */
export function getAugmentName(augmentId) {
  // 증강 데이터는 복잡해서 기본적으로 ID 반환
  // 필요시 augmentData에서 검색 가능
  const augments = Object.values(augmentData.data);
  const augment = augments.find(a => a.id === augmentId || a.name === augmentId);
  return augment ? augment.name : augmentId;
}

/**
 * 모든 챔피언 데이터 가져오기
 */
export function getAllChampions() {
  return championMap;
}

/**
 * 모든 시너지 데이터 가져오기
 */
export function getAllTraits() {
  return traitMap;
}

/**
 * 특정 시너지에 속한 챔피언 목록 가져오기
 * 참고: 이 정보는 JSON에 없으므로 하드코딩 필요
 */
export function getChampionsByTrait(traitId) {
  // 이 부분은 synergyInfo.js에서 가져와야 함
  return [];
}

// 기본 export
export default {
  getChampionName,
  getChampionImage,
  getChampionCost,
  getTraitName,
  getTraitImage,
  getItemName,
  getItemImage,
  getAugmentName,
  getAllChampions,
  getAllTraits,
  getChampionsByTrait,
};
