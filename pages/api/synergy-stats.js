import { loadAnalyzedData } from "../../utils/dataStorage";

// 시너지 통계 조회 API
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const analyzedData = loadAnalyzedData() || global.analyzedData;

    if (!analyzedData) {
      return res.status(404).json({
        error: "분석된 데이터가 없습니다",
      });
    }

    return res.status(200).json({
      synergies: analyzedData.synergyRankings,
      totalMatches: analyzedData.totalMatches,
      lastAnalyzed: analyzedData.lastAnalyzed,
    });
  } catch (error) {
    return res.status(500).json({
      error: "시너지 통계 조회 중 오류 발생",
      details: error.message,
    });
  }
}
