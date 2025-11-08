import { useState } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import { POWERUPS_DATA } from "../utils/powerupData";

export default function PowerupsPage() {
  const [filterCategory, setFilterCategory] = useState("all");

  // 모든 파워업 데이터 합치기
  const allPowerups = [
    ...POWERUPS_DATA.offensive.map((p) => ({ ...p, category: "offensive" })),
    ...POWERUPS_DATA.defensive.map((p) => ({ ...p, category: "defensive" })),
    ...POWERUPS_DATA.growth.map((p) => ({ ...p, category: "growth" })),
    ...POWERUPS_DATA.utility.map((p) => ({ ...p, category: "utility" })),
    ...POWERUPS_DATA.special.map((p) => ({ ...p, category: "special" })),
  ];

  // 카테고리별 필터링
  const filteredPowerups =
    filterCategory === "all"
      ? allPowerups
      : allPowerups.filter((p) => p.category === filterCategory);

  // 카테고리 이모지
  const getCategoryEmoji = (category) => {
    if (category === "offensive") return "⚔️";
    if (category === "defensive") return "🛡️";
    if (category === "growth") return "📈";
    if (category === "utility") return "🔧";
    if (category === "special") return "✨";
    return "⭐";
  };

  // 카테고리 색상
  const getCategoryColor = (category) => {
    if (category === "offensive") return "#ef4444";
    if (category === "defensive") return "#3b82f6";
    if (category === "growth") return "#10b981";
    if (category === "utility") return "#f59e0b";
    if (category === "special") return "#a855f7";
    return "#8b5cf6";
  };

  // 카테고리 한글명
  const getCategoryName = (category) => {
    if (category === "offensive") return "공격형";
    if (category === "defensive") return "방어형";
    if (category === "growth") return "성장형";
    if (category === "utility") return "유틸리티";
    if (category === "special") return "특수";
    return "기타";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>파워업 - TFT META WIKI</title>
        <meta name="description" content="TFT 시즌 15 파워업 정보" />
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
            <button
              className={styles.navLink}
              onClick={() => (window.location.href = "/synergies")}
            >
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
            <button className={`${styles.navLink} ${styles.active}`}>
              파워업
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>⚡</span>
              파워업 효과 목록
            </h1>
            <p className={styles.sectionSubtitle}>
              TFT 시즌 15 파워업 시스템 - 챔피언에게 추가 능력 부여
            </p>
          </div>

          {/* 파워업 설명 */}
          <div className={styles.powerupInfo}>
            <p>
              파워업은 <strong>1-3 라운드</strong>와 <strong>3-6 라운드</strong>에 파워 간식(악마의 열매)을 받아 챔피언에게 적용할 수 있는 강력한 효과입니다.
            </p>
            <p>
              각 챔피언은 역할군, 특성, 챔피언 고유 선택지 중에서 무작위로 파워업을 선택할 수 있습니다.
            </p>
          </div>

          {/* 필터 옵션 */}
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <span className={styles.sortLabel}>카테고리:</span>
              <button
                className={`${styles.sortBtn} ${
                  filterCategory === "all" ? styles.active : ""
                }`}
                onClick={() => setFilterCategory("all")}
              >
                전체 ({allPowerups.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterCategory === "offensive" ? styles.active : ""
                }`}
                onClick={() => setFilterCategory("offensive")}
              >
                ⚔️ 공격형 ({POWERUPS_DATA.offensive.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterCategory === "defensive" ? styles.active : ""
                }`}
                onClick={() => setFilterCategory("defensive")}
              >
                🛡️ 방어형 ({POWERUPS_DATA.defensive.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterCategory === "growth" ? styles.active : ""
                }`}
                onClick={() => setFilterCategory("growth")}
              >
                📈 성장형 ({POWERUPS_DATA.growth.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterCategory === "utility" ? styles.active : ""
                }`}
                onClick={() => setFilterCategory("utility")}
              >
                🔧 유틸리티 ({POWERUPS_DATA.utility.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterCategory === "special" ? styles.active : ""
                }`}
                onClick={() => setFilterCategory("special")}
              >
                ✨ 특수 ({POWERUPS_DATA.special.length})
              </button>
            </div>
          </div>

          <div className={styles.augmentList}>
            {filteredPowerups.map((powerup, index) => (
              <div
                key={index}
                className={styles.powerupListItem}
                style={{
                  borderLeft: `4px solid ${getCategoryColor(powerup.category)}`,
                }}
              >
                <div className={styles.powerupMainContent}>
                  <div className={styles.augmentListHeader}>
                    <span className={styles.augmentTier}>
                      {getCategoryEmoji(powerup.category)}
                    </span>
                    <h3 className={styles.augmentNameList}>{powerup.name}</h3>
                    <span className={styles.powerupCategory}>
                      {getCategoryName(powerup.category)}
                    </span>
                  </div>
                  <p className={styles.augmentDescriptionList}>
                    {powerup.description}
                  </p>
                </div>
                {powerup.champions && (
                  <div className={styles.powerupChampions}>
                    <span className={styles.powerupChampionsLabel}>획득 가능:</span>
                    <span className={styles.powerupChampionsText}>
                      {powerup.champions}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>TFT META WIKI © 2025 | Master+ Data Analysis</p>
        <p>데이터는 수동으로 업데이트됩니다</p>
      </footer>
    </div>
  );
}
