// 증강 통계 조회 API
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const analyzedData = global.analyzedData;

    if (!analyzedData) {
      return res.status(404).json({
        error: "분석된 데이터가 없습니다",
      });
    }

    // 티어별로 분류 (이름 패턴으로 추정)
    const augmentsByTier = {
      silver: [],
      gold: [],
      prismatic: [],
    };

    analyzedData.augmentRankings.forEach((aug) => {
      const name = aug.name.toLowerCase();
      // 실제로는 Data Dragon API에서 티어 정보를 가져와야 함
      if (
        name.includes("heart") ||
        name.includes("crest") ||
        name.includes("crown")
      ) {
        augmentsByTier.prismatic.push(aug);
      } else if (name.includes("ii") || name.includes("plus")) {
        augmentsByTier.gold.push(aug);
      } else {
        augmentsByTier.silver.push(aug);
      }
    });

    return res.status(200).json({
      all: analyzedData.augmentRankings,
      byTier: augmentsByTier,
      totalMatches: analyzedData.totalMatches,
      lastAnalyzed: analyzedData.lastAnalyzed,
    });
  } catch (error) {
    return res.status(500).json({
      error: "증강 통계 조회 중 오류 발생",
      details: error.message,
    });
  }
}
