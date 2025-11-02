import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  const maxPlayers = parseInt(req.query.limit) || 20;
  const maxMatches = parseInt(req.query.matches) || 5;

  console.log("=== 데이터 수집 시작 ===");
  console.log(`플레이어: ${maxPlayers}명, 매치: ${maxMatches}개/인`);

  if (!apiKey) {
    return res.status(500).json({
      error: "Riot API 키가 설정되지 않았습니다",
      message: ".env.local 파일에 RIOT_API_KEY를 설정하세요",
    });
  }

  try {
    const allMatchData = [];
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // API 요청 함수 (재시도 로직 포함)
    const apiRequest = async (url, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.get(url, {
            headers: { "X-Riot-Token": apiKey },
            timeout: 10000,
          });
          return response;
        } catch (err) {
          const status = err.response?.status;

          if (status === 403) {
            console.error("❌ API 키 에러 (403)");
            throw new Error("API 키를 확인하세요");
          } else if (status === 429) {
            console.log("⚠️ Rate Limit, 10초 대기...");
            await delay(10000);
          } else if (status === 404) {
            throw err;
          } else {
            await delay(2000 * (i + 1));
          }

          if (i === retries - 1) throw err;
        }
      }
    };

    // 챌린저 리그 플레이어 수집
    const challengerUrl = `https://kr.api.riotgames.com/tft/league/v1/challenger`;
    const challengerResponse = await apiRequest(challengerUrl);

    let masterPlusPlayers = challengerResponse.data.entries.slice(
      0,
      maxPlayers
    );
    console.log(`✓ 챌린저 ${masterPlusPlayers.length}명 조회 완료`);

    await delay(500);

    // 매치 데이터 수집
    console.log("매치 데이터 수집 중...");

    for (let i = 0; i < masterPlusPlayers.length; i++) {
      try {
        const entry = masterPlusPlayers[i];

        const puuid = entry.puuid;
        if (!puuid) continue;

        // 매치 ID 목록 조회
        const matchListUrl = `https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${maxMatches}`;
        const matchListResponse = await apiRequest(matchListUrl);

        const matchIds = matchListResponse.data;
        await delay(500); // ← 0.5초

        // 각 매치 상세 정보 조회
        for (const matchId of matchIds) {
          try {
            const matchUrl = `https://asia.api.riotgames.com/tft/match/v1/matches/${matchId}`;
            const matchResponse = await apiRequest(matchUrl);

            allMatchData.push(matchResponse.data);
            await delay(600);
          } catch (err) {
            // 매치 조회 실패는 조용히 건너뜀
          }
        }

        if ((i + 1) % 5 === 0 || i === masterPlusPlayers.length - 1) {
          console.log(`진행: ${i + 1}/${masterPlusPlayers.length} (매치: ${allMatchData.length}개)`);
        }
      } catch (err) {
        // 플레이어 처리 실패는 조용히 건너뜀
      }
    }

    console.log(`✓ 수집 완료: ${allMatchData.length}개 매치`);

    global.masterMatchData = allMatchData;
    global.lastUpdateTime = new Date();

    return res.status(200).json({
      success: true,
      playersCollected: masterPlusPlayers.length,
      matchesCollected: allMatchData.length,
      timestamp: global.lastUpdateTime,
    });
  } catch (error) {
    console.error("❌ 수집 에러:", error.message);
    return res.status(500).json({
      error: "데이터 수집 실패",
      details: error.message,
    });
  }
}
