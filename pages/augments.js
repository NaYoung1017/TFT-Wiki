import { useState } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import { AUGMENTS_DATA } from "../utils/augmentData";

export default function AugmentsPage() {
  const [filterTier, setFilterTier] = useState("all"); // all, silver, gold, prismatic

  // 모든 증강 데이터 합치기
  const allAugments = [
    ...AUGMENTS_DATA.silver.map((aug) => ({ ...aug, tier: "silver" })),
    ...AUGMENTS_DATA.gold.map((aug) => ({ ...aug, tier: "gold" })),
    ...AUGMENTS_DATA.prismatic.map((aug) => ({ ...aug, tier: "prismatic" })),
  ];

  // 티어별 필터링
  const filteredAugments =
    filterTier === "all"
      ? allAugments
      : allAugments.filter((aug) => aug.tier === filterTier);

  // 티어 이모지
  const getTierEmoji = (tier) => {
    if (tier === "silver") return "🥈";
    if (tier === "gold") return "🥇";
    if (tier === "prismatic") return "💎";
    return "⭐";
  };

  // 티어 색상
  const getTierColor = (tier) => {
    if (tier === "silver") return "#c0c0c0";
    if (tier === "gold") return "#ffd700";
    if (tier === "prismatic") return "#b19cd9";
    return "#999";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>증강 통계 - TFT META WIKI</title>
        <meta name="description" content="TFT 시즌 15 증강 효과 및 통계" />
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
            <button className={`${styles.navLink} ${styles.active}`}>
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
              <span className={styles.titleIcon}>✨</span>
              증강 효과 및 통계
            </h1>
            <p className={styles.sectionSubtitle}>
              마스터+ 티어 기준 증강별 성적 분석
            </p>
          </div>

          {/* 필터 옵션 */}
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <span className={styles.sortLabel}>티어:</span>
              <button
                className={`${styles.sortBtn} ${
                  filterTier === "all" ? styles.active : ""
                }`}
                onClick={() => setFilterTier("all")}
              >
                전체 ({allAugments.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterTier === "silver" ? styles.active : ""
                }`}
                onClick={() => setFilterTier("silver")}
              >
                🥈 실버 ({AUGMENTS_DATA.silver.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterTier === "gold" ? styles.active : ""
                }`}
                onClick={() => setFilterTier("gold")}
              >
                🥇 골드 ({AUGMENTS_DATA.gold.length})
              </button>
              <button
                className={`${styles.sortBtn} ${
                  filterTier === "prismatic" ? styles.active : ""
                }`}
                onClick={() => setFilterTier("prismatic")}
              >
                💎 프리즘 ({AUGMENTS_DATA.prismatic.length})
              </button>
            </div>
          </div>

          <div className={styles.augmentList}>
            {filteredAugments.map((augment, index) => (
              <div
                key={index}
                className={styles.augmentListItem}
                style={{
                  borderLeft: `4px solid ${getTierColor(augment.tier)}`,
                }}
              >
                <div className={styles.augmentListHeader}>
                  <span className={styles.augmentTier}>
                    {getTierEmoji(augment.tier)}
                  </span>
                  <h3 className={styles.augmentNameList}>{augment.name}</h3>
                </div>
                <p className={styles.augmentDescriptionList}>
                  {augment.description}
                </p>
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
