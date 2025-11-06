import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import {
  getTraitName,
  getChampionName,
  getChampionImage,
  getTraitImage,
  getChampionCost,
} from "../utils/tftDataLoader";
import { getSynergyInfo } from "../utils/synergyInfo";
import {
  getPlayStyleRecommendation,
} from "../utils/synergyLevelCalculator";
import {
  analyzePowerSpike,
  analyzeThreeStarRequirements,
  recommendGoldTiming,
} from "../utils/powerSpikeAnalyzer";

export default function SynergiesPage() {
  const [synergies, setSynergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("avgPlacement");
  const [selectedSynergy, setSelectedSynergy] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleSynergyClick = (synergy) => {
    setSelectedSynergy(synergy);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSynergy(null);
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
          <div
            className={styles.logo}
            onClick={() => (window.location.href = "/")}
            style={{ cursor: "pointer" }}
          >
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
                const synergyInfo = getSynergyInfo(synergy.name);

                return (
                  <div
                    key={index}
                    className={styles.synergyRow}
                    onClick={() => handleSynergyClick(synergy)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* 왼쪽: 랭킹 & 기본 정보 */}
                    <div className={styles.synergyLeft}>
                      <div className={styles.synergyRankBig}>#{index + 1}</div>
                      <div className={styles.synergyMainInfo}>
                        <div className={styles.synergyTitleRow}>
                          {getTraitImage(synergy.name) && (
                            <img
                              src={getTraitImage(synergy.name)}
                              alt={
                                synergyInfo
                                  ? synergyInfo.name
                                  : getTraitName(synergy.name)
                              }
                              className={styles.synergyIcon}
                              style={{
                                width: "40px",
                                height: "40px",
                                marginRight: "12px",
                              }}
                            />
                          )}
                          <h3 className={styles.synergyNameBig}>
                            {synergyInfo
                              ? synergyInfo.name
                              : getTraitName(synergy.name)}
                          </h3>
                        </div>
                        {synergyInfo && (
                          <p className={styles.synergyDescription}>
                            {synergyInfo.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 오른쪽: 통계 */}
                    <div className={styles.synergyStatsRight}>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>평균 등수</span>
                        <span
                          className={`${styles.statValue} ${styles.highlight}`}
                        >
                          {synergy.avgPlacement}위
                        </span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>승률</span>
                        <span className={styles.statValue}>
                          {synergy.winRate}%
                        </span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>픽률</span>
                        <span className={styles.statValue}>
                          {synergy.pickRate}%
                        </span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statLabel}>Top 4</span>
                        <span className={styles.statValue}>
                          {synergy.top4Rate}%
                        </span>
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

      {/* 시너지 상세 모달 */}
      {showModal && selectedSynergy && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={closeModal}>
              ✕
            </button>

            {(() => {
              const synergyInfo = getSynergyInfo(selectedSynergy.name);

              return (
                <>
                  {/* 모달 헤더 */}
                  <div className={styles.modalHeader}>
                    <div className={styles.modalTitleRow}>
                      {getTraitImage(selectedSynergy.name) && (
                        <img
                          src={getTraitImage(selectedSynergy.name)}
                          alt={
                            synergyInfo
                              ? synergyInfo.name
                              : getTraitName(selectedSynergy.name)
                          }
                          className={styles.modalSynergyIcon}
                        />
                      )}
                      <h2 className={styles.modalTitle}>
                        {synergyInfo
                          ? synergyInfo.name
                          : getTraitName(selectedSynergy.name)}
                      </h2>
                    </div>
                    {synergyInfo && (
                      <p className={styles.modalDescription}>
                        {synergyInfo.description}
                      </p>
                    )}
                  </div>


                  {/* 시너지 효과 */}
                  {synergyInfo && synergyInfo.tiers && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>
                        ⚔️ 시너지 효과
                      </h3>
                      <div className={styles.synergyEffectList}>
                        {synergyInfo.tiers.map((tierInfo, idx) => (
                          <div key={idx} className={styles.synergyEffectItem}>
                            <span className={styles.synergyEffectCount}>
                              ({tierInfo.count})
                            </span>
                            <span className={styles.synergyEffectText}>
                              {tierInfo.effect}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 포함 챔피언 */}
                  {synergyInfo && synergyInfo.champions && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>
                        🎯 포함 챔피언
                      </h3>
                      <div className={styles.championGrid}>
                        {synergyInfo.champions.map((champ, idx) => {
                          const cost = getChampionCost(champ);
                          return (
                            <div key={idx} className={styles.championGridItem}>
                              <div className={styles.championIconWrapper}>
                                <img
                                  src={getChampionImage(champ)}
                                  alt={getChampionName(champ)}
                                  className={styles.championIconModal}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <span
                                  className={styles.championFallback}
                                  style={{ display: "none" }}
                                >
                                  {getChampionName(champ).slice(0, 2)}
                                </span>
                                {cost && (
                                  <span
                                    className={`${styles.championCostBadge} ${
                                      styles[`cost${cost}`]
                                    }`}
                                  >
                                    {cost}
                                  </span>
                                )}
                              </div>
                              <span className={styles.championName}>
                                {getChampionName(champ)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 통계 정보 */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>📊 상세 통계</h3>
                    <div className={styles.statsGrid}>
                      <div className={styles.statsGridItem}>
                        <span className={styles.statsGridLabel}>평균 등수</span>
                        <span className={styles.statsGridValue}>
                          {selectedSynergy.avgPlacement}등
                        </span>
                      </div>
                      <div className={styles.statsGridItem}>
                        <span className={styles.statsGridLabel}>승률</span>
                        <span className={styles.statsGridValue}>
                          {selectedSynergy.winRate}%
                        </span>
                      </div>
                      <div className={styles.statsGridItem}>
                        <span className={styles.statsGridLabel}>픽률</span>
                        <span className={styles.statsGridValue}>
                          {selectedSynergy.pickRate}%
                        </span>
                      </div>
                      <div className={styles.statsGridItem}>
                        <span className={styles.statsGridLabel}>
                          4등 이내 비율
                        </span>
                        <span className={styles.statsGridValue}>
                          {selectedSynergy.top4Rate}%
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* 플레이 스타일 추천 */}
                  {synergyInfo &&
                    synergyInfo.champions && (
                      <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>
                          💡 플레이 스타일 추천
                        </h3>
                        {(() => {
                          const playStyle = getPlayStyleRecommendation(
                            synergyInfo.champions,
                            synergyInfo.tiers
                          );
                          if (!playStyle) {
                            return (
                              <p>플레이 스타일 정보를 불러올 수 없습니다.</p>
                            );
                          }
                          return (
                            <div className={styles.playStyleCard}>
                              <h4 className={styles.playStyleTitle}>
                                {playStyle.style}
                              </h4>
                              <p className={styles.playStyleDescription}>
                                {playStyle.description}
                              </p>
                              <div className={styles.playStyleTips}>
                                <strong>핵심 팁:</strong>
                                <ul className={styles.playStyleTipList}>
                                  {playStyle.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  {/* 파워 스파이크 분석 */}
                  {synergyInfo &&
                    synergyInfo.champions && (
                      <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>
                          📈 레벨별 파워 스파이크
                        </h3>
                        {(() => {
                          const powerSpike = analyzePowerSpike(
                            synergyInfo.champions,
                            synergyInfo.tiers
                          );
                          if (
                            !powerSpike ||
                            !powerSpike.levelPowers ||
                            powerSpike.levelPowers.length === 0
                          ) {
                            return (
                              <p>파워 스파이크 데이터를 불러올 수 없습니다.</p>
                            );
                          }

                          // 최대값 찾기
                          const maxPower = Math.max(
                            ...powerSpike.levelPowers.map((lp) => lp.power)
                          );

                          return (
                            <div className={styles.powerSpikeGraphContainer}>
                              <div className={styles.powerSpikeChart}>
                                {powerSpike.levelPowers.map(
                                  (levelData, idx) => {
                                    // 최대 220px 높이로 스케일링
                                    const heightPx =
                                      (levelData.power / maxPower) * 220;
                                    const isStrong =
                                      levelData.power >= maxPower * 0.8;
                                    const isMedium =
                                      levelData.power >= maxPower * 0.6 &&
                                      !isStrong;

                                    return (
                                      <div
                                        key={idx}
                                        className={styles.powerSpikeBarWrapper}
                                      >
                                        <div
                                          className={
                                            styles.powerSpikeBarVertical
                                          }
                                          style={{
                                            height: `${heightPx}px`,
                                            backgroundColor: isStrong
                                              ? "#10b981"
                                              : isMedium
                                              ? "#3b82f6"
                                              : "#6b7280",
                                          }}
                                          title={`레벨 ${levelData.level}: 파워 ${levelData.power}`}
                                        />
                                        <span
                                          className={
                                            styles.powerSpikeLevelLabel
                                          }
                                        >
                                          {levelData.level}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                              <div className={styles.powerSpikeLegend}>
                                <div className={styles.powerSpikeLegendItem}>
                                  <div
                                    className={styles.powerSpikeLegendColor}
                                    style={{ backgroundColor: "#10b981" }}
                                  ></div>
                                  <span>강함 (파워 스파이크)</span>
                                </div>
                                <div className={styles.powerSpikeLegendItem}>
                                  <div
                                    className={styles.powerSpikeLegendColor}
                                    style={{ backgroundColor: "#3b82f6" }}
                                  ></div>
                                  <span>중간</span>
                                </div>
                                <div className={styles.powerSpikeLegendItem}>
                                  <div
                                    className={styles.powerSpikeLegendColor}
                                    style={{ backgroundColor: "#6b7280" }}
                                  ></div>
                                  <span>약함</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  {/* 3성 챔피언 추천 */}
                  {synergyInfo && synergyInfo.champions && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>
                        ⭐ 3성 챔피언 추천
                      </h3>
                      {(() => {
                        const threeStarAnalysis = analyzeThreeStarRequirements(
                          synergyInfo.champions
                        );
                        if (
                          !threeStarAnalysis ||
                          !threeStarAnalysis.recommendations ||
                          threeStarAnalysis.recommendations.length === 0
                        ) {
                          return (
                            <p>3성 챔피언 추천 데이터를 불러올 수 없습니다.</p>
                          );
                        }
                        return (
                          <div className={styles.threeStarContainer}>
                            {threeStarAnalysis.recommendations.map(
                              (rec, idx) => (
                                <div key={idx} className={styles.threeStarCard}>
                                  <div className={styles.threeStarChampion}>
                                    <img
                                      src={getChampionImage(rec.champion)}
                                      alt={getChampionName(rec.champion)}
                                      className={styles.threeStarIcon}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                    <span
                                      className={styles.championFallback}
                                      style={{ display: "none" }}
                                    >
                                      {getChampionName(rec.champion).slice(
                                        0,
                                        2
                                      )}
                                    </span>
                                    <span className={styles.threeStarName}>
                                      {getChampionName(rec.champion)}
                                    </span>
                                  </div>
                                  <div className={styles.threeStarInfo}>
                                    <p className={styles.threeStarPriority}>
                                      우선순위: {rec.priority}
                                    </p>
                                    <p className={styles.threeStarReason}>
                                      {rec.reason}
                                    </p>
                                    <p className={styles.threeStarCost}>
                                      필요 골드: {rec.goldCost}G
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 골드 타이밍 추천 */}
                  {synergyInfo &&
                    synergyInfo.champions && (
                      <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>
                          💰 골드 사용 타이밍
                        </h3>
                        {(() => {
                          const goldTiming = recommendGoldTiming(
                            synergyInfo.champions,
                            synergyInfo.tiers
                          );
                          if (
                            !goldTiming ||
                            !goldTiming.stages ||
                            goldTiming.stages.length === 0
                          ) {
                            return (
                              <p>골드 타이밍 데이터를 불러올 수 없습니다.</p>
                            );
                          }
                          return (
                            <div className={styles.goldTimingContainer}>
                              {goldTiming.stages.map((stage, idx) => (
                                <div
                                  key={idx}
                                  className={styles.goldTimingCard}
                                >
                                  <div className={styles.goldTimingHeader}>
                                    <span className={styles.goldTimingStage}>
                                      {stage.stage}
                                    </span>
                                    <span className={styles.goldTimingAction}>
                                      {stage.action}
                                    </span>
                                  </div>
                                  <p className={styles.goldTimingReason}>
                                    {stage.reason}
                                  </p>
                                  <p className={styles.goldTimingTarget}>
                                    목표 골드: {stage.targetGold}G
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
