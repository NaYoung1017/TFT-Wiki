import { useState } from "react";
import Head from "next/head";
import styles from "../styles/MetaWiki.module.css";
import itemStyles from "../styles/Items.module.css";
import {
  BASIC_ITEMS,
  COMPLETED_ITEMS,
  EMBLEM_ITEMS,
} from "../utils/itemsInfo";

export default function ItemsPage() {
  const [filter, setFilter] = useState("items"); // items, emblem

  // 완성 아이템 필터링
  const getFilteredItems = () => {
    if (filter === "emblem") {
      return Object.entries(EMBLEM_ITEMS);
    }
    return Object.entries(COMPLETED_ITEMS);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className={styles.container}>
      <Head>
        <title>아이템 가이드 - TFT META WIKI</title>
        <meta name="description" content="TFT 시즌 15 아이템 조합 및 통계" />
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
            <button className={`${styles.navLink} ${styles.active}`}>
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
        {/* 완성 아이템 목록 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>⚔️</span>
              완성 아이템
            </h1>
            <p className={styles.sectionSubtitle}>
              마스터+ 티어 기준 아이템별 효과 및 성적 분석
            </p>
          </div>

          {/* 필터 버튼 */}
          <div className={styles.sortPanel}>
            <span className={styles.sortLabel}>분류:</span>
            <button
              className={`${styles.sortBtn} ${
                filter === "items" ? styles.active : ""
              }`}
              onClick={() => setFilter("items")}
            >
              아이템
            </button>
            <button
              className={`${styles.sortBtn} ${
                filter === "emblem" ? styles.active : ""
              }`}
              onClick={() => setFilter("emblem")}
            >
              상징
            </button>
          </div>

          <div className={itemStyles.itemListHorizontal}>
            {filteredItems.map(([key, item], index) => (
              <div key={key} className={itemStyles.itemRowHorizontal}>
                {/* 순위 */}
                <div className={itemStyles.itemRank}>#{index + 1}</div>

                {/* 아이템 아이콘 */}
                <div className={itemStyles.itemIconLarge}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={itemStyles.itemImage}
                    />
                  ) : (
                    item.name.slice(0, 2)
                  )}
                </div>

                {/* 아이템 정보 */}
                <div className={itemStyles.itemInfo}>
                  <h3 className={itemStyles.itemNameLarge}>{item.name}</h3>
                  <p className={itemStyles.itemEffectText}>{item.effect}</p>
                  <div className={itemStyles.itemComponentsInline}>
                    <span className={itemStyles.componentBadge}>
                      {BASIC_ITEMS[item.components[0]].name}
                    </span>
                    <span className={itemStyles.componentPlus}>+</span>
                    <span className={itemStyles.componentBadge}>
                      {BASIC_ITEMS[item.components[1]].name}
                    </span>
                  </div>
                </div>

                {/* 통계 */}
                {item.stats && (
                  <div className={itemStyles.itemStatsInline}>
                    <div className={itemStyles.statBoxInline}>
                      <span className={itemStyles.statLabelInline}>평균 등수</span>
                      <span className={itemStyles.statValueInline}>
                        {item.stats.avgPlace}위
                      </span>
                    </div>
                    <div className={itemStyles.statBoxInline}>
                      <span className={itemStyles.statLabelInline}>픽률</span>
                      <span className={itemStyles.statValueInline}>
                        {item.stats.pickRate}
                      </span>
                    </div>
                    <div className={itemStyles.statBoxInline}>
                      <span className={itemStyles.statLabelInline}>승률</span>
                      <span className={itemStyles.statValueInline}>
                        {item.stats.winRate}
                      </span>
                    </div>
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
