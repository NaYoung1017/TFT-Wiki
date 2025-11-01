// 메타 랭킹 조회 API
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const analyzedData = global.analyzedData;

    if (!analyzedData) {
      return res.status(404).json({
        error: "분석된 데이터가 없습니다",
        message:
          "/api/collect-master-data와 /api/analyze-meta를 먼저 실행하세요",
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
