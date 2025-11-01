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

  try {
    const allMatchData = [];
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // 1. 챌린저 리그 플레이어 수집
    console.log("Step 1: 챌린저 리그 조회");
    const challengerUrl = `https://kr.api.riotgames.com/tft/league/v1/challenger`;
    const challengerResponse = await axios.get(challengerUrl, {
      headers: { "X-Riot-Token": apiKey },
    });

    // 챌린저만 사용
    let masterPlusPlayers = challengerResponse.data.entries.slice(
      0,
      maxPlayers
    );
    console.log("챌린저:", masterPlusPlayers.length);

    await delay(200); // ← 200ms로 늘림

    // 그랜드마스터와 마스터는 생략
    console.log("Step 2-3: 건너뛰기 (시간 절약)");

    // 4. 각 플레이어의 매치 데이터 수집
    console.log("Step 4: 매치 데이터 수집 시작");

    for (let i = 0; i < masterPlusPlayers.length; i++) {
      try {
        const entry = masterPlusPlayers[i];

        // Summoner ID로 PUUID 조회
        const summonerUrl = `https://kr.api.riotgames.com/tft/summoner/v1/summoners/${entry.summonerId}`;
        const summonerResponse = await axios.get(summonerUrl, {
          headers: { "X-Riot-Token": apiKey },
          timeout: 10000,
        });

        const puuid = summonerResponse.data.puuid;
        await delay(200); // ← 200ms

        // 매치 ID 목록 조회
        const matchListUrl = `https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${maxMatches}`;
        const matchListResponse = await axios.get(matchListUrl, {
          headers: { "X-Riot-Token": apiKey },
          timeout: 10000,
        });

        const matchIds = matchListResponse.data;
        await delay(200); // ← 200ms

        // 각 매치 상세 정보 조회
        for (const matchId of matchIds) {
          try {
            const matchUrl = `https://asia.api.riotgames.com/tft/match/v1/matches/${matchId}`;
            const matchResponse = await axios.get(matchUrl, {
              headers: { "X-Riot-Token": apiKey },
              timeout: 10000,
            });

            allMatchData.push(matchResponse.data);
            await delay(200); // ← 200ms
          } catch (err) {
            console.log("매치 조회 실패:", matchId);
          }
        }

        console.log(
          `진행: ${i + 1}/${masterPlusPlayers.length} (${
            allMatchData.length
          } 매치)`
        );
      } catch (err) {
        console.log("플레이어 처리 실패:", err.message);
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
