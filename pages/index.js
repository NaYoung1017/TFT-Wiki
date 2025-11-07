import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import { getChampionName, getTraitName, getItemName, getChampionImage, getAugmentName, getTraitImage, getChampionCost, getItemImage } from "../utils/tftDataLoader";

export default function TFTMetaWiki() {
  const [activeSection, setActiveSection] = useState("meta");
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collecting, setCollecting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // 데이터 로드
  useEffect(() => {
    loadMetaData();
  }, []);

  const loadMetaData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/meta-rankings?limit=20");

      if (!response.ok) {
        throw new Error("데이터를 불러올 수 없습니다");
      }

      const data = await response.json();
      setMetaData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 데이터 수집
  const collectData = async () => {
    if (collecting) return;

    setCollecting(true);
    try {
      const response = await fetch(
        "/api/collect-master-data?limit=20&matches=5",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("데이터 수집 실패");
      }

      const result = await response.json();
      alert(
        `수집 완료!\n플레이어: ${result.playersCollected}\n매치: ${result.matchesCollected}`
      );

      // 자동으로 분석 시작
      await analyzeData();
    } catch (err) {
      alert("데이터 수집 실패: " + err.message);
    } finally {
      setCollecting(false);
    }
  };

  // 데이터 분석
  const analyzeData = async () => {
    if (analyzing) return;

    setAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-meta", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("데이터 분석 실패");
      }

      const result = await response.json();
      alert(
        `분석 완료!\n메타: ${result.metaComps}\n시너지: ${result.synergies}\n증강: ${result.augments}`
      );

      // 데이터 새로고침
      await loadMetaData();
    } catch (err) {
      alert("데이터 분석 실패: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openMetaDetail = (meta) => {
    setSelectedMeta(meta);
  };

  const closeMetaDetail = () => {
    setSelectedMeta(null);
  };

  const getTierClass = (avgPlacement) => {
    const place = parseFloat(avgPlacement);
    if (place <= 3.5) return "S";
    if (place <= 4.0) return "A";
    return "B";
  };

  // 메타 이름을 한글로 변환 (시너지 조합)
  const getKoreanMetaName = (meta) => {
    if (meta.traits && meta.traits.length > 0) {
      return meta.traits.map(t => getTraitName(t)).join(" + ");
    }
    // fallback: meta.name에서 직접 변환
    return meta.name.split(" + ").map(t => getTraitName(t)).join(" + ");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TFT META WIKI - 시즌 15</title>
        <meta
          name="description"
          content="TFT 시즌 15 메타 분석 - 마스터+ 데이터 기반"
        />
      </Head>

      {/* 네비게이션 바 */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏆</span>
            <span className={styles.logoText}>TFT META WIKI</span>
            <span className={styles.season}>S15</span>
          </div>
          <div className={styles.navLinks}>
            <button
              className={`${styles.navLink} ${
                activeSection === "meta" ? styles.active : ""
              }`}
              onClick={() => scrollToSection("meta")}
            >
              메타 랭킹
            </button>
            <button
              className={`${styles.navLink} ${
                activeSection === "synergy" ? styles.active : ""
              }`}
              onClick={() => (window.location.href = "/synergies")}
            >
              시너지
            </button>
            <button
              className={`${styles.navLink} ${
                activeSection === "items" ? styles.active : ""
              }`}
              onClick={() => (window.location.href = "/items")}
            >
              아이템
            </button>
            <button
              className={`${styles.navLink} ${
                activeSection === "augments" ? styles.active : ""
              }`}
              onClick={() => (window.location.href = "/augments")}
            >
              증강
            </button>
            <button
              className={`${styles.navLink} ${
                activeSection === "powerups" ? styles.active : ""
              }`}
              onClick={() => (window.location.href = "/powerups")}
            >
              파워업
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>

        {/* 메타 랭킹 섹션 */}
        <section id="meta" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>💎</span>
              TOP META COMPOSITIONS
            </h1>
            {metaData && (
              <p className={styles.sectionSubtitle}>
                마스터+ {metaData.totalMatches}게임 분석 | 최근 업데이트:{" "}
                {new Date(metaData.lastUpdate).toLocaleString("ko-KR")}
              </p>
            )}
          </div>

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>데이터 로딩 중...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <p>⚠️ {error}</p>
              <p className={styles.errorHint}>
                먼저 "데이터 수집" 버튼을 클릭하여 마스터+ 플레이어 데이터를
                수집하세요.
              </p>
            </div>
          )}

          {!loading && !error && metaData && metaData.metaComps && (
            <div className={styles.metaGrid}>
              {metaData.metaComps.map((meta, index) => {
                const tier = getTierClass(meta.avgPlacement);
                return (
                  <div
                    key={index}
                    className={`${styles.metaCard} ${styles[`tier${tier}`]}`}
                    onClick={() => openMetaDetail(meta)}
                  >
                    <div className={styles.metaRank}>
                      <span className={styles.rankNumber}>#{index + 1}</span>
                      <span
                        className={`${styles.tierBadge} ${
                          styles[`tier${tier}`]
                        }`}
                      >
                        {tier}
                      </span>
                    </div>

                    <h3 className={styles.metaName}>{getKoreanMetaName(meta)}</h3>

                    {/* 시너지 아이콘 */}
                    {meta.traits && meta.traits.length > 0 && (
                      <div className={styles.traitIcons}>
                        {meta.traits.map((trait, idx) => (
                          <div key={idx} className={styles.traitIcon} title={getTraitName(trait)}>
                            <img
                              src={getTraitImage(trait)}
                              alt={getTraitName(trait)}
                              className={styles.traitImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <span className={styles.traitFallback} style={{display: 'none'}}>
                              {getTraitName(trait).slice(0, 2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.metaStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>승률</span>
                        <span className={styles.statValue}>
                          {meta.winRate}%
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>픽률</span>
                        <span className={styles.statValue}>
                          {meta.pickRate}%
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>평균</span>
                        <span className={styles.statValue}>
                          {meta.avgPlacement}등
                        </span>
                      </div>
                    </div>

                    <div className={styles.championIcons}>
                      {meta.topChampions &&
                        meta.topChampions.slice(0, 7).map((champ, idx) => (
                          <div
                            key={idx}
                            className={styles.champIcon}
                            title={getChampionName(champ.name)}
                          >
                            <img
                              src={getChampionImage(champ.name)}
                              alt={getChampionName(champ.name)}
                              className={styles.champImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <span className={styles.champFallback} style={{display: 'none'}}>
                              {getChampionName(champ.name).slice(0, 2)}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>게임 수:</span>
                      <span className={styles.infoValue}>{meta.games}</span>
                    </div>

                    <button className={styles.detailBtn}>자세히 보기 →</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 메타 상세 모달 */}
      {selectedMeta && (
        <div className={styles.modal} onClick={closeMetaDetail}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={closeMetaDetail}>
              ✕
            </button>

            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{getKoreanMetaName(selectedMeta)}</h2>
              <div className={styles.modalBadges}>
                <span
                  className={`${styles.tierBadge} ${
                    styles[`tier${getTierClass(selectedMeta.avgPlacement)}`]
                  }`}
                >
                  {getTierClass(selectedMeta.avgPlacement)} 티어
                </span>
              </div>
            </div>

            <div className={styles.modalStats}>
              <div className={styles.modalStatCard}>
                <span className={styles.modalStatLabel}>승률</span>
                <span className={styles.modalStatValue}>
                  {selectedMeta.winRate}%
                </span>
              </div>
              <div className={styles.modalStatCard}>
                <span className={styles.modalStatLabel}>픽률</span>
                <span className={styles.modalStatValue}>
                  {selectedMeta.pickRate}%
                </span>
              </div>
              <div className={styles.modalStatCard}>
                <span className={styles.modalStatLabel}>평균 등수</span>
                <span className={styles.modalStatValue}>
                  {selectedMeta.avgPlacement}등
                </span>
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                🎯 자주 사용된 챔피언
              </h3>
              <div className={styles.championList}>
                {selectedMeta.topChampions &&
                  selectedMeta.topChampions
                    .sort((a, b) => {
                      const costA = getChampionCost(a.name);
                      const costB = getChampionCost(b.name);
                      if (costA !== costB) {
                        return costA - costB; // 코스트 오름차순
                      }
                      return b.count - a.count; // 같은 코스트면 사용 빈도순
                    })
                    .map((champ, idx) => (
                      <div key={idx} className={styles.championItem}>
                        <div className={styles.championItemIcon}>
                          <img
                            src={getChampionImage(champ.name)}
                            alt={getChampionName(champ.name)}
                            className={styles.champIconLarge}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <span className={styles.champIconLarge} style={{display: 'none', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)'}}>
                            {getChampionName(champ.name).slice(0, 2)}
                          </span>
                          <span className={`${styles.costBadge} ${styles[`cost${getChampionCost(champ.name)}`]}`}>
                            {getChampionCost(champ.name)}
                          </span>
                        </div>
                        <div className={styles.championItemInfo}>
                          <span className={styles.championItemName}>
                            {getChampionName(champ.name)}
                          </span>
                          <span className={styles.championItemCount}>
                            {champ.count}회 사용
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                💎 자주 사용된 아이템 조합
              </h3>
              {selectedMeta.topItems &&
                selectedMeta.topItems.map((item, idx) => (
                  <div key={idx} className={styles.itemRecommend}>
                    <div className={styles.itemComboRow}>
                      <span className={styles.itemCombo}>
                        {item.combo.split(' + ').map(i => getItemName(i)).join(' + ')}
                      </span>
                      <span className={styles.itemCount}>({item.count}회)</span>
                    </div>
                    {item.champions && item.champions.length > 0 && (
                      <div className={styles.itemChampions}>
                        <span className={styles.itemChampionsLabel}>주요 사용 챔피언:</span>
                        {item.champions.map((champ, champIdx) => (
                          <span key={champIdx} className={styles.itemChampionTag}>
                            {getChampionName(champ.name)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>✨ 자주 선택된 증강</h3>
              <div className={styles.augmentList}>
                {selectedMeta.topAugments &&
                  selectedMeta.topAugments.map((aug, idx) => (
                    <span key={idx} className={styles.augmentTag}>
                      {getAugmentName(aug.name)} ({aug.count}회)
                    </span>
                  ))}
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>⚡ 레벨별 덱 파워</h3>
              <div className={styles.powerByLevel}>
                {selectedMeta.levelPowers && selectedMeta.levelPowers.length > 0 ? (
                  (() => {
                    // 핵심 레벨 찾기 (Top4 비율이 가장 높은 레벨)
                    const peakLevel = selectedMeta.levelPowers
                      .filter(l => l.games >= 3)
                      .reduce((max, curr) =>
                        parseFloat(curr.top4Rate) > parseFloat(max.top4Rate) ? curr : max,
                        selectedMeta.levelPowers[0]
                      )?.level;

                    return [5, 6, 7, 8, 9].map((targetLevel) => {
                      const levelData = selectedMeta.levelPowers.find(l => l.level === targetLevel);
                      const isPeakLevel = targetLevel === peakLevel;

                      let powerPercent, powerText;

                      if (levelData && levelData.games >= 3) {
                        // 실제 데이터가 있는 경우
                        powerPercent = Math.min(100, parseFloat(levelData.top4Rate) + 20);
                        const rate = parseFloat(levelData.top4Rate);
                        if (rate >= 60) powerText = "매우 강함";
                        else if (rate >= 50) powerText = "강함";
                        else if (rate >= 40) powerText = "중간";
                        else powerText = "약함";
                      } else {
                        // 데이터가 부족한 경우 추정값
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

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>⭐ 3성 필수 챔피언</h3>
              <div className={styles.keyChampions}>
                {selectedMeta.keyChampions && selectedMeta.keyChampions.length > 0 ? (
                  selectedMeta.keyChampions.map((champ, idx) => (
                    <div key={idx} className={styles.keyChampionItem}>
                      <div className={styles.keyChampionIcon}>
                        <img
                          src={getChampionImage(champ.name)}
                          alt={getChampionName(champ.name)}
                          className={styles.champIconMedium}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <span className={styles.champIconMedium} style={{display: 'none', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)'}}>
                          {getChampionName(champ.name).slice(0, 2)}
                        </span>
                        <span className={`${styles.costBadge} ${styles[`cost${getChampionCost(champ.name)}`]}`}>
                          {getChampionCost(champ.name)}
                        </span>
                      </div>
                      <span className={styles.keyChampionName}>{getChampionName(champ.name)}</span>
                      <span className={styles.keyChampionPriority}>
                        우선순위 {idx + 1}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>이 덱은 3성 챔피언이 필수적이지 않습니다 (레벨업 우선)</p>
                )}
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>🎯 리롤 타이밍</h3>
              <div className={styles.rerollGuide}>
                {selectedMeta.rerollTiming ? (
                  <>
                    <div className={`${styles.rerollPhase} ${styles[`priority${selectedMeta.rerollTiming.earlyGame.priority}`]}`}>
                      <span className={styles.rerollStage}>{selectedMeta.rerollTiming.earlyGame.stage}</span>
                      <span className={styles.rerollAction}>
                        초반 세팅
                        {selectedMeta.rerollTiming.earlyGame.priority === 'high' && ' ⚡'}
                        {selectedMeta.rerollTiming.earlyGame.priority === 'medium' && ' ⭐'}
                      </span>
                      <p className={styles.rerollDesc}>{selectedMeta.rerollTiming.earlyGame.description}</p>
                    </div>
                    <div className={`${styles.rerollPhase} ${styles[`priority${selectedMeta.rerollTiming.midGame.priority}`]}`}>
                      <span className={styles.rerollStage}>{selectedMeta.rerollTiming.midGame.stage}</span>
                      <span className={styles.rerollAction}>
                        핵심 구간
                        {selectedMeta.rerollTiming.midGame.priority === 'high' && ' ⚡'}
                        {selectedMeta.rerollTiming.midGame.priority === 'medium' && ' ⭐'}
                      </span>
                      <p className={styles.rerollDesc}>{selectedMeta.rerollTiming.midGame.description}</p>
                    </div>
                    <div className={`${styles.rerollPhase} ${styles[`priority${selectedMeta.rerollTiming.lateGame.priority}`]}`}>
                      <span className={styles.rerollStage}>{selectedMeta.rerollTiming.lateGame.stage}</span>
                      <span className={styles.rerollAction}>
                        후반 전략
                        {selectedMeta.rerollTiming.lateGame.priority === 'high' && ' ⚡'}
                        {selectedMeta.rerollTiming.lateGame.priority === 'medium' && ' ⭐'}
                      </span>
                      <p className={styles.rerollDesc}>{selectedMeta.rerollTiming.lateGame.description}</p>
                    </div>
                  </>
                ) : (
                  <p className={styles.noData}>리롤 타이밍 데이터가 없습니다</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>TFT META WIKI © 2025 | Master+ Data Analysis</p>
        <p>데이터는 수동으로 업데이트됩니다</p>

        {/* 관리자 패널 */}
        <div className={styles.adminPanel}>
          <button
            className={styles.adminBtn}
            onClick={collectData}
            disabled={collecting || analyzing}
          >
            {collecting ? "수집 중..." : "데이터 수집"}
          </button>
          <button
            className={styles.adminBtn}
            onClick={analyzeData}
            disabled={collecting || analyzing}
          >
            {analyzing ? "분석 중..." : "데이터 분석"}
          </button>
        </div>
      </footer>
    </div>
  );
}
