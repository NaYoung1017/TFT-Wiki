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
  analyzeThreeStarRequirements,
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

                  {/* 상세 통계 */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>📊 상세 통계</h3>
                    <div className={styles.statsGridFixed}>
                      <div className={styles.statCard}>
                        <span className={styles.statCardLabel}>총 게임 수</span>
                        <span className={styles.statCardValue}>{selectedSynergy.games}게임</span>
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statCardLabel}>평균 등수</span>
                        <span className={`${styles.statCardValue} ${styles.highlight}`}>
                          {selectedSynergy.avgPlacement}위
                        </span>
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statCardLabel}>승률</span>
                        <span className={styles.statCardValue}>{selectedSynergy.winRate}%</span>
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statCardLabel}>Top 4 비율</span>
                        <span className={styles.statCardValue}>{selectedSynergy.top4Rate}%</span>
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statCardLabel}>픽률</span>
                        <span className={styles.statCardValue}>{selectedSynergy.pickRate}%</span>
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statCardLabel}>평균 레벨</span>
                        <span className={styles.statCardValue}>
                          {selectedSynergy.avgLevel ? `Lv ${selectedSynergy.avgLevel}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 플레이 스타일 추천 */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>💡 플레이 스타일 추천</h3>
                    {selectedSynergy.playStyle ? (
                      <div className={styles.playStyleCard}>
                        <div className={styles.playStyleHeader}>
                          <h4 className={styles.playStyleTitle}>{selectedSynergy.playStyle.type}</h4>
                          <span className={`${styles.playStyleBadge} ${
                            selectedSynergy.playStyle.type.includes('리롤') ? styles.rerollBadge : styles.levelBadge
                          }`}>
                            {selectedSynergy.playStyle.type.includes('리롤') ? '🎯 리롤 덱' : '📈 레벨업 덱'}
                          </span>
                        </div>
                        <p className={styles.playStyleDescription}>
                          {selectedSynergy.playStyle.type.includes('리롤')
                            ? '저코스트 챔피언을 3성으로 만들어 강력한 파워를 발휘하는 덱입니다. 초중반에 집중적인 리롤이 필요합니다.'
                            : '고코스트 챔피언의 시너지 조합으로 후반 파워를 노리는 덱입니다. 안정적인 경제 운영이 중요합니다.'
                          }
                        </p>
                        {selectedSynergy.avgLevel && (
                          <div className={styles.playStyleStats}>
                            <div className={styles.playStyleStat}>
                              <span className={styles.playStyleStatLabel}>평균 목표 레벨</span>
                              <span className={styles.playStyleStatValue}>Lv {selectedSynergy.avgLevel}</span>
                            </div>
                            <div className={styles.playStyleStat}>
                              <span className={styles.playStyleStatLabel}>리롤 집중도</span>
                              <span className={styles.playStyleStatValue}>
                                {selectedSynergy.playStyle.type.includes('리롤') ? '높음 ⚡' : '낮음 📊'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className={styles.noData}>플레이 스타일 데이터가 없습니다</p>
                    )}
                  </div>

                  {/* 레벨별 덱 파워 */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>⚡ 레벨별 덱 파워</h3>
                    <div className={styles.powerByLevel}>
                      {selectedSynergy.levelPowers && selectedSynergy.levelPowers.length > 0 ? (
                        (() => {
                          const peakLevel = selectedSynergy.levelPowers
                            .filter(l => l.games >= 3)
                            .reduce((max, curr) =>
                              parseFloat(curr.top4Rate) > parseFloat(max.top4Rate) ? curr : max,
                              selectedSynergy.levelPowers[0]
                            )?.level;

                          return [5, 6, 7, 8, 9].map((targetLevel) => {
                            const levelData = selectedSynergy.levelPowers.find(l => l.level === targetLevel);
                            const isPeakLevel = targetLevel === peakLevel;

                            let powerPercent, powerText;

                            if (levelData && levelData.games >= 3) {
                              powerPercent = Math.min(100, parseFloat(levelData.top4Rate) + 20);
                              const rate = parseFloat(levelData.top4Rate);
                              if (rate >= 60) powerText = "매우 강함";
                              else if (rate >= 50) powerText = "강함";
                              else if (rate >= 40) powerText = "중간";
                              else powerText = "약함";
                            } else {
                              if (targetLevel <= 6) { powerPercent = 35; powerText = "약함"; }
                              else if (targetLevel === 7) { powerPercent = 55; powerText = "중간"; }
                              else if (targetLevel === 8) { powerPercent = 75; powerText = "강함"; }
                              else { powerPercent = 85; powerText = "매우 강함"; }
                            }

                            return (
                              <div key={targetLevel} className={styles.powerLevelItem}>
                                <span className={styles.powerLevel}>
                                  Lv {targetLevel}
                                  {isPeakLevel && <span className={styles.peakBadge}>핵심</span>}
                                </span>
                                <div className={styles.powerBar}>
                                  <div className={styles.powerBarFill} style={{width: `${powerPercent}%`}}></div>
                                </div>
                                <span className={styles.powerText}>
                                  {powerText}
                                </span>
                              </div>
                            );
                          });
                        })()
                      ) : (
                        <p className={styles.noData}>레벨별 데이터가 충분하지 않습니다</p>
                      )}
                    </div>
                  </div>

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
                            <p className={styles.noData}>이 시너지는 특정 챔피언을 3성으로 만들 필요가 없습니다.</p>
                          );
                        }
                        return (
                          <div className={styles.threeStarContainer}>
                            {threeStarAnalysis.recommendations.map(
                              (rec, idx) => {
                                const cost = getChampionCost(rec.champion);
                                return (
                                  <div key={idx} className={styles.threeStarCard}>
                                    <div className={styles.threeStarChampionWrapper}>
                                      <div className={styles.championIconWrapper}>
                                        <img
                                          src={getChampionImage(rec.champion)}
                                          alt={getChampionName(rec.champion)}
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
                                          {getChampionName(rec.champion).slice(0, 2)}
                                        </span>
                                        {cost && (
                                          <span className={`${styles.championCostBadge} ${styles[`cost${cost}`]}`}>
                                            {cost}
                                          </span>
                                        )}
                                      </div>
                                      <span className={styles.championName}>
                                        {getChampionName(rec.champion)}
                                      </span>
                                    </div>
                                    <div className={styles.threeStarInfo}>
                                      <span className={styles.threeStarPriority}>
                                        우선순위 {rec.priority}
                                      </span>
                                      <p className={styles.threeStarReason}>
                                        {rec.reason}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 골드 사용 타이밍 */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>💰 골드 사용 타이밍</h3>
                    {selectedSynergy.playStyle && selectedSynergy.playStyle.goldTiming ? (
                      <div className={styles.rerollGuide}>
                        <div className={`${styles.rerollPhase} ${styles[`priority${selectedSynergy.playStyle.goldTiming.early.priority}`]}`}>
                          <span className={styles.rerollStage}>{selectedSynergy.playStyle.goldTiming.early.stage}</span>
                          <span className={styles.rerollAction}>
                            {selectedSynergy.playStyle.goldTiming.early.action}
                            {selectedSynergy.playStyle.goldTiming.early.priority === 'high' && ' ⚡'}
                            {selectedSynergy.playStyle.goldTiming.early.priority === 'medium' && ' ⭐'}
                          </span>
                          <p className={styles.rerollDesc}>{selectedSynergy.playStyle.goldTiming.early.desc}</p>
                        </div>
                        <div className={`${styles.rerollPhase} ${styles[`priority${selectedSynergy.playStyle.goldTiming.mid.priority}`]}`}>
                          <span className={styles.rerollStage}>{selectedSynergy.playStyle.goldTiming.mid.stage}</span>
                          <span className={styles.rerollAction}>
                            {selectedSynergy.playStyle.goldTiming.mid.action}
                            {selectedSynergy.playStyle.goldTiming.mid.priority === 'high' && ' ⚡'}
                            {selectedSynergy.playStyle.goldTiming.mid.priority === 'medium' && ' ⭐'}
                          </span>
                          <p className={styles.rerollDesc}>{selectedSynergy.playStyle.goldTiming.mid.desc}</p>
                        </div>
                        <div className={`${styles.rerollPhase} ${styles[`priority${selectedSynergy.playStyle.goldTiming.late.priority}`]}`}>
                          <span className={styles.rerollStage}>{selectedSynergy.playStyle.goldTiming.late.stage}</span>
                          <span className={styles.rerollAction}>
                            {selectedSynergy.playStyle.goldTiming.late.action}
                            {selectedSynergy.playStyle.goldTiming.late.priority === 'high' && ' ⚡'}
                            {selectedSynergy.playStyle.goldTiming.late.priority === 'medium' && ' ⭐'}
                          </span>
                          <p className={styles.rerollDesc}>{selectedSynergy.playStyle.goldTiming.late.desc}</p>
                        </div>
                      </div>
                    ) : (
                      <p className={styles.noData}>골드 사용 타이밍 데이터가 없습니다</p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
