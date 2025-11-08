import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const MATCH_DATA_FILE = path.join(DATA_DIR, 'match-data.json');
const ANALYZED_DATA_FILE = path.join(DATA_DIR, 'analyzed-data.json');

// 데이터 폴더가 없으면 생성
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 매치 데이터 저장
export function saveMatchData(matchData) {
  try {
    ensureDataDir();
    const data = {
      matches: matchData,
      lastUpdate: new Date().toISOString(),
      count: matchData.length
    };
    fs.writeFileSync(MATCH_DATA_FILE, JSON.stringify(data), 'utf-8');
    console.log(`✓ 매치 데이터 저장 완료: ${matchData.length}개`);
    return true;
  } catch (error) {
    console.error('❌ 매치 데이터 저장 실패:', error.message);
    return false;
  }
}

// 매치 데이터 로드
export function loadMatchData() {
  try {
    if (!fs.existsSync(MATCH_DATA_FILE)) {
      return null;
    }
    const fileContent = fs.readFileSync(MATCH_DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`✓ 매치 데이터 로드: ${data.count}개 (${data.lastUpdate})`);
    return data.matches;
  } catch (error) {
    console.error('❌ 매치 데이터 로드 실패:', error.message);
    return null;
  }
}

// 분석 데이터 저장
export function saveAnalyzedData(analyzedData) {
  try {
    ensureDataDir();
    const data = {
      ...analyzedData,
      savedAt: new Date().toISOString()
    };
    fs.writeFileSync(ANALYZED_DATA_FILE, JSON.stringify(data), 'utf-8');
    console.log(`✓ 분석 데이터 저장 완료`);
    return true;
  } catch (error) {
    console.error('❌ 분석 데이터 저장 실패:', error.message);
    return false;
  }
}

// 분석 데이터 로드
export function loadAnalyzedData() {
  try {
    if (!fs.existsSync(ANALYZED_DATA_FILE)) {
      return null;
    }
    const fileContent = fs.readFileSync(ANALYZED_DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`✓ 분석 데이터 로드: ${data.totalMatches}개 매치 (${data.savedAt})`);
    return data;
  } catch (error) {
    console.error('❌ 분석 데이터 로드 실패:', error.message);
    return null;
  }
}

// 데이터 존재 여부 확인
export function hasData() {
  return fs.existsSync(MATCH_DATA_FILE) && fs.existsSync(ANALYZED_DATA_FILE);
}

// 데이터 정보 가져오기
export function getDataInfo() {
  try {
    if (!hasData()) {
      return null;
    }

    const matchStats = fs.statSync(MATCH_DATA_FILE);
    const analyzedStats = fs.statSync(ANALYZED_DATA_FILE);

    const matchData = JSON.parse(fs.readFileSync(MATCH_DATA_FILE, 'utf-8'));
    const analyzedData = JSON.parse(fs.readFileSync(ANALYZED_DATA_FILE, 'utf-8'));

    return {
      matchCount: matchData.count,
      lastUpdate: matchData.lastUpdate,
      lastAnalyzed: analyzedData.savedAt,
      metaComps: analyzedData.metaComps?.length || 0,
      fileSize: (matchStats.size + analyzedStats.size) / 1024 / 1024 // MB
    };
  } catch (error) {
    return null;
  }
}
