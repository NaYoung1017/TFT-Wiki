import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import { toKoreanTrait } from "../utils/translations";

export default function SynergiesPage() {
  const [synergies, setSynergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("avgPlacement"); // avgPlacement, pickRate, winRate

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
        <meta name="description" content="TFT 시즌 15 시너지 통계" />
      </Head>

      {/* 네비게이션 바 */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo} onClick={() => (window.location.href = "/")}>
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
              시너지 통계
            </h1>
            <p className={styles.sectionSubtitle}>
              마스터+ 티어 기준 시너지별 성적 분석
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
            <div className={styles.synergyGrid}>
              {sortedSynergies.map((synergy, index) => {
                const tier = getTierClass(synergy.avgPlacement);
                return (
                  <div
                    key={index}
                    className={`${styles.synergyCard} ${styles[`tier${tier}`]}`}
                  >
                    <div className={styles.synergyHeader}>
                      <div className={styles.synergyTitle}>
                        <h3 className={styles.synergyName}>
                          {toKoreanTrait(synergy.name)}
                        </h3>
                        <span
                          className={`${styles.tierBadge} ${
                            styles[`tier${tier}`]
                          }`}
                        >
                          {tier}
                        </span>
                      </div>
                      <div className={styles.synergyRank}>#{index + 1}</div>
                    </div>

                    <div className={styles.synergyStats}>
                      <div className={styles.statRow}>
                        <span className={styles.statLabel}>평균 등수</span>
                        <span className={`${styles.statValue} ${styles.highlight}`}>
                          {synergy.avgPlacement}위
                        </span>
                      </div>
                      <div className={styles.statRow}>
                        <span className={styles.statLabel}>승률</span>
                        <span className={styles.statValue}>
                          {synergy.winRate}%
                        </span>
                      </div>
                      <div className={styles.statRow}>
                        <span className={styles.statLabel}>픽률</span>
                        <span className={styles.statValue}>
                          {synergy.pickRate}%
                        </span>
                      </div>
                      <div className={styles.statRow}>
                        <span className={styles.statLabel}>Top 4 비율</span>
                        <span className={styles.statValue}>
                          {synergy.top4Rate}%
                        </span>
                      </div>
                    </div>

                    <div className={styles.synergyFooter}>
                      <span className={styles.gamesPlayed}>
                        {synergy.games}게임 플레이
                      </span>
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
