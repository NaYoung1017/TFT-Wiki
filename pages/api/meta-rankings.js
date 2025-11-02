import { loadAnalyzedData } from "../../utils/dataStorage";

// 메타 랭킹 조회 API
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 파일에서 로드 시도, 없으면 메모리에서
    const analyzedData = loadAnalyzedData() || global.analyzedData;

    if (!analyzedData) {
      return res.status(404).json({
        error: "분석된 데이터가 없습니다",
        message: "먼저 데이터를 수집하고 분석하세요",
      });
    }

    const limit = parseInt(req.query.limit) || 10;

    return res.status(200).json({
      metaComps: analyzedData.metaComps.slice(0, limit),
      totalMatches: analyzedData.totalMatches,
      lastAnalyzed: analyzedData.lastAnalyzed,
      lastUpdate: global.lastUpdateTime,
    });
  } catch (error) {
    return res.status(500).json({
      error: "메타 랭킹 조회 중 오류 발생",
      details: error.message,
    });
  }
}
