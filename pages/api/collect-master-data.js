import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  const maxPlayers = parseInt(req.query.limit) || 5; // ← 5명만
  const maxMatches = parseInt(req.query.matches) || 3; // ← 3게임만

  console.log("=== 마스터+ 데이터 수집 시작 ===");
  console.log("목표 플레이어:", maxPlayers);
  console.log("플레이어당 매치:", maxMatches);
  console.log("API 키 확인:", apiKey ? "설정됨" : "❌ 설정 안됨");

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
          console.log(`API 요청 실패 (시도 ${i + 1}/${retries}):`, status, err.message);
          console.log("요청 URL:", url);
          console.log("에러 응답:", err.response?.data);

          if (status === 403) {
            console.error("❌ 403 에러: API 키가 유효하지 않거나 권한이 없습니다");
            console.error("가능한 원인:");
            console.error("  1. API 키가 만료됨 (24시간마다 갱신 필요)");
            console.error("  2. TFT API 접근 권한 없음");
            console.error("  3. 요청 URL이 잘못됨");
            console.error("해결: https://developer.riotgames.com/ 에서 API 키 재발급");
            throw new Error("API 키를 확인하세요 (403 Forbidden)");
          } else if (status === 429) {
            console.log("⚠️ Rate Limit 초과! 10초 대기...");
            await delay(10000); // Rate limit이면 10초 대기
          } else if (status === 404) {
            console.log("⚠️ 데이터 없음 (404)");
            throw err;
          } else {
            await delay(2000 * (i + 1)); // 점진적 대기
          }

          if (i === retries - 1) throw err;
        }
      }
    };

    // 1. 챌린저 리그 플레이어 수집
    console.log("Step 1: 챌린저 리그 조회");
    const challengerUrl = `https://kr.api.riotgames.com/tft/league/v1/challenger`;
    const challengerResponse = await apiRequest(challengerUrl);

    // 챌린저만 사용
    let masterPlusPlayers = challengerResponse.data.entries.slice(
      0,
      maxPlayers
    );
    console.log("챌린저:", masterPlusPlayers.length);

    await delay(1000); // ← 1초로 증가

    // 그랜드마스터와 마스터는 생략
    console.log("Step 2-3: 건너뛰기 (시간 절약)");

    // 4. 각 플레이어의 매치 데이터 수집
    console.log("Step 4: 매치 데이터 수집 시작");
    console.log("⚠️ Rate Limit 때문에 느리게 진행됩니다 (1초/요청)");

    for (let i = 0; i < masterPlusPlayers.length; i++) {
      try {
        const entry = masterPlusPlayers[i];

        // Summoner ID로 PUUID 조회
        const summonerUrl = `https://kr.api.riotgames.com/tft/summoner/v1/summoners/${entry.summonerId}`;
        const summonerResponse = await apiRequest(summonerUrl);

        const puuid = summonerResponse.data.puuid;
        await delay(1000); // ← 1초

        // 매치 ID 목록 조회
        const matchListUrl = `https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${maxMatches}`;
        const matchListResponse = await apiRequest(matchListUrl);

        const matchIds = matchListResponse.data;
        await delay(1000); // ← 1초

        // 각 매치 상세 정보 조회
        for (const matchId of matchIds) {
          try {
            const matchUrl = `https://asia.api.riotgames.com/tft/match/v1/matches/${matchId}`;
            const matchResponse = await apiRequest(matchUrl);

            allMatchData.push(matchResponse.data);
            await delay(1000); // ← 1초
          } catch (err) {
            console.log("매치 조회 실패:", matchId, err.message);
          }
        }

        console.log(
          `✓ 진행: ${i + 1}/${masterPlusPlayers.length} (${
            allMatchData.length
          } 매치 수집 완료)`
        );
      } catch (err) {
        console.log("❌ 플레이어 처리 실패:", err.message);
      }
    }

    console.log("=== 수집 완료 ===");
    console.log("총 매치 수:", allMatchData.length);

    // 5. 수집된 데이터를 분석 API에 전달하여 저장
    // (실제로는 데이터베이스에 저장해야 하지만, 여기서는 메모리에 저장)
    global.masterMatchData = allMatchData;
    global.lastUpdateTime = new Date();

    return res.status(200).json({
      success: true,
      playersCollected: masterPlusPlayers.length,
      matchesCollected: allMatchData.length,
      timestamp: global.lastUpdateTime,
    });
  } catch (error) {
    console.error("❌ 데이터 수집 에러:", error.message);

    return res.status(500).json({
      error: "데이터 수집 중 오류 발생",
      details: error.message,
    });
  }
}
