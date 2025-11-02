import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import { getTraitName, getChampionName, getChampionImage, getTraitImage } from "../utils/tftDataLoader";
import { getSynergyInfo } from "../utils/synergyInfo";

export default function SynergiesPage() {
  const [synergies, setSynergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("avgPlacement");

  useEffect(() => {
    loadSynergies();
  }, []);

  const loadSynergies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/synergy-stats");

      if (!response.ok) {
        throw new Error("시너지 데이터를 불러올 수 없습니다");
      }

      const data = await response.json();
      setSynergies(data.synergies || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedSynergies = [...synergies].sort((a, b) => {
    if (sortBy === "avgPlacement") {
      return parseFloat(a.avgPlacement) - parseFloat(b.avgPlacement);
    } else if (sortBy === "pickRate") {
      return parseFloat(b.pickRate) - parseFloat(a.pickRate);
    } else if (sortBy === "winRate") {
      return parseFloat(b.winRate) - parseFloat(a.winRate);
    }
    return 0;
  });

  const getTierClass = (avgPlacement) => {
    const place = parseFloat(avgPlacement);
    if (place <= 3.5) return "S";
    if (place <= 4.0) return "A";
    if (place <= 4.5) return "B";
    return "C";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>시너지 통계 - TFT META WIKI</title>
        <meta name="description" content="TFT 시즌 15 시너지 효과 및 통계" />
      </Head>

      {/* 네비게이션 바 */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo} onClick={() => (window.location.href = "/")} style={{cursor: 'pointer'}}>
            <span className={styles.logoIcon}>🏆</span>
            <span className={styles.logoText}>TFT META WIKI</span>
            <span className={styles.season}>S15</span>
          </div>
          <div className={styles.navLinks}>
            <button
              className={styles.navLink}
              onClick={() => (window.location.href = "/")}
            >
              메타 랭킹
            </button>
            <button className={`${styles.navLink} ${styles.active}`}>
              시너지
            </button>
            <button
              className={styles.navLink}
              onClick={() => (window.location.href = "/items")}
            >
              아이템
            </button>
            <button
              className={styles.navLink}
              onClick={() => (window.location.href = "/augments")}
            >
              증강
            </button>
            <button
              className={styles.navLink}
              onClick={() => (window.location.href = "/powerups")}
            >
              파워업
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>⚔️</span>
              시너지 효과 및 통계
            </h1>
            <p className={styles.sectionSubtitle}>
              마스터+ 티어 기준 시너지별 효과, 포함 챔피언, 성적 분석
            </p>
          </div>

          {/* 정렬 옵션 */}
          <div className={styles.sortPanel}>
            <span className={styles.sortLabel}>정렬 기준:</span>
            <button
              className={`${styles.sortBtn} ${
                sortBy === "avgPlacement" ? styles.active : ""
              }`}
              onClick={() => setSortBy("avgPlacement")}
            >
              평균 등수
            </button>
            <button
              className={`${styles.sortBtn} ${
                sortBy === "winRate" ? styles.active : ""
              }`}
              onClick={() => setSortBy("winRate")}
            >
              승률
            </button>
            <button
              className={`${styles.sortBtn} ${
                sortBy === "pickRate" ? styles.active : ""
              }`}
              onClick={() => setSortBy("pickRate")}
            >
              픽률
            </button>
          </div>

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>시너지 데이터 로딩 중...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <p>⚠️ {error}</p>
              <p className={styles.errorHint}>
                먼저 데이터를 수집하고 분석하세요.
              </p>
            </div>
          )}

          {!loading && !error && sortedSynergies.length > 0 && (
            <div className={styles.synergyList}>
              {sortedSynergies.map((synergy, index) => {
                const tier = getTierClass(synergy.avgPlacement);
                const synergyInfo = getSynergyInfo(synergy.name);

                return (
                  <div
                    key={index}
                    className={`${styles.synergyRow} ${styles[`tier${tier}`]}`}
                  >
                    {/* 왼쪽: 랭킹 & 기본 정보 */}
                    <div className={styles.synergyLeft}>
                      <div className={styles.synergyRankBig}>#{index + 1}</div>
                      <div className={styles.synergyMainInfo}>
                        <div className={styles.synergyTitleRow}>
                          <h3 className={styles.synergyNameBig}>
                            {synergyInfo ? synergyInfo.name : getTraitName(synergy.name)}
                          </h3>
                          <span className={`${styles.tierBadge} ${styles[`tier${tier}`]}`}>
                            {tier}
                          </span>
                        </div>
                        {synergyInfo && (
                          <p className={styles.synergyDescription}>
                            {synergyInfo.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 중앙: 효과 & 챔피언 */}
                    <div className={styles.synergyCenterInfo}>
                      {synergyInfo && synergyInfo.tiers && (
                        <div className={styles.synergyTiers}>
                          <h4 className={styles.infoTitle}>시너지 효과</h4>
                          <div className={styles.tierEffectList}>
                            {synergyInfo.tiers.map((tierInfo, idx) => (
                              <div key={idx} className={styles.tierEffectItem}>
                                <span className={styles.tierCount}>({tierInfo.count})</span>
                                <span className={styles.tierEffect}>{tierInfo.effect}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {synergyInfo && synergyInfo.champions && (
                        <div className={styles.synergyChampions}>
                          <h4 className={styles.infoTitle}>포함 챔피언</h4>
                          <div className={styles.championIconList}>
                            {synergyInfo.champions.map((champ, idx) => (
                              <div key={idx} className={styles.champIconSmall} title={getChampionName(champ)}>
                                <img
                                  src={getChampionImage(champ)}
                                  alt={getChampionName(champ)}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <span style={{display: 'none'}}>
                                  {getChampionName(champ).slice(0, 1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 오른쪽: 통계 */}
                    <div className={styles.synergyStatsRight}>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>평균 등수</span>
                        <span className={`${styles.statValue} ${styles.highlight}`}>
                          {synergy.avgPlacement}위
                        </span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>승률</span>
                        <span className={styles.statValue}>{synergy.winRate}%</span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>픽률</span>
                        <span className={styles.statValue}>{synergy.pickRate}%</span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>Top 4</span>
                        <span className={styles.statValue}>{synergy.top4Rate}%</span>
                      </div>
                      <div className={styles.synergyGames}>
                        {synergy.games}게임
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>TFT META WIKI © 2025 | Master+ Data Analysis</p>
        <p>데이터는 수동으로 업데이트됩니다</p>
      </footer>
    </div>
  );
}
