import { loadAnalyzedData } from "../../utils/dataStorage";

// 증강 통계 조회 API
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

    // 증강에 티어 정보 추가
    const augmentsWithTier = analyzedData.augmentRankings.map((aug) => {
      const name = aug.name.toLowerCase();
      let tier = "silver"; // 기본값

      // 이름 패턴으로 티어 추정
      if (
        name.includes("heart") ||
        name.includes("crest") ||
        name.includes("crown") ||
        name.includes("legend")
      ) {
        tier = "prismatic";
      } else if (
        name.includes("ii") ||
        name.includes("2") ||
        name.includes("plus") ||
        name.includes("+")
      ) {
        tier = "gold";
      }

      return {
        ...aug,
        tier,
        description: aug.description || "증강 효과 설명이 없습니다.",
      };
    });

    return res.status(200).json({
      augments: augmentsWithTier,
      totalMatches: analyzedData.totalMatches,
      lastAnalyzed: analyzedData.savedAt || analyzedData.lastAnalyzed,
    });
  } catch (error) {
    return res.status(500).json({
      error: "증강 통계 조회 중 오류 발생",
      details: error.message,
    });
  }
}
