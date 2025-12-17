<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useGameState } from "@/composables/useGameState";
import {
  NEWS_EVENTS,
  getYearFromMinedPercent,
  getMonthName,
} from "@/data/newsEvents";
import type { NewsEvent } from "@/types/game";

const { globalBitcoinMined, MAX_BITCOIN, addEvent } = useGameState();

// Track which news events have been shown
const shownNewsIds = ref<Set<string>>(new Set());

// Current progress percentage
const minedPercent = computed(() => {
  return (globalBitcoinMined.value / MAX_BITCOIN) * 100;
});

// Current date based on progress
const currentDate = computed(() => {
  return getYearFromMinedPercent(minedPercent.value);
});

const formattedDate = computed(() => {
  const { year, month } = currentDate.value;
  return `${getMonthName(month)} ${year}`;
});

// Get all unlocked news (events that have been passed)
const unlockedNews = computed(() => {
  return NEWS_EVENTS.filter(
    (event) => event.minedPercent <= minedPercent.value
  ).sort((a, b) => b.minedPercent - a.minedPercent);
});

// Latest 5 news items
const recentNews = computed(() => {
  return unlockedNews.value.slice(0, 5);
});

// Current headline (most recent)
const currentHeadline = computed(() => {
  return unlockedNews.value[0] || null;
});

// Watch for new events and trigger notifications
watch(minedPercent, (newPercent) => {
  NEWS_EVENTS.forEach((event) => {
    if (event.minedPercent <= newPercent && !shownNewsIds.value.has(event.id)) {
      shownNewsIds.value.add(event.id);
      // Add to event log
      const prefix = event.isFuture ? "📰 [FUTURE]" : "📰";
      addEvent(`${prefix} ${event.headline}`);
    }
  });
});

// Show expanded news modal
const showNewsModal = ref(false);
const selectedNews = ref<NewsEvent | null>(null);

const openNews = (news: NewsEvent) => {
  selectedNews.value = news;
  showNewsModal.value = true;
};

const closeNews = () => {
  showNewsModal.value = false;
  selectedNews.value = null;
};
</script>

<template>
  <div class="news-section">
    <!-- Date Display -->
    <div class="date-display">
      <span class="date-label">📅</span>
      <span class="date-value">{{ formattedDate }}</span>
    </div>

    <!-- News Ticker -->
    <div class="news-ticker" v-if="currentHeadline">
      <div class="ticker-label">📰 NEWS</div>
      <div class="ticker-content" @click="openNews(currentHeadline)">
        <span class="ticker-emoji">{{ currentHeadline.emoji }}</span>
        <span class="ticker-headline">{{ currentHeadline.headline }}</span>
        <span v-if="currentHeadline.isFuture" class="future-badge">FUTURE</span>
      </div>
    </div>

    <!-- Recent News Dropdown -->
    <div class="recent-news">
      <details>
        <summary class="news-summary">
          View History ({{ unlockedNews.length }} events)
        </summary>
        <div class="news-list">
          <div
            v-for="news in recentNews"
            :key="news.id"
            class="news-item"
            :class="{ 'future-event': news.isFuture }"
            @click="openNews(news)">
            <span class="news-emoji">{{ news.emoji }}</span>
            <div class="news-content">
              <span class="news-year">{{ news.year }}</span>
              <span class="news-headline">{{ news.headline }}</span>
            </div>
          </div>
          <div v-if="unlockedNews.length > 5" class="more-news">
            + {{ unlockedNews.length - 5 }} more events...
          </div>
        </div>
      </details>
    </div>

    <!-- News Modal -->
    <Teleport to="body">
      <div
        v-if="showNewsModal && selectedNews"
        class="news-modal-overlay"
        @click="closeNews">
        <div class="news-modal" @click.stop>
          <button class="close-btn" @click="closeNews">×</button>
          <div class="modal-emoji">{{ selectedNews.emoji }}</div>
          <div class="modal-date">
            {{ getMonthName(selectedNews.month) }} {{ selectedNews.year }}
            <span v-if="selectedNews.isFuture" class="future-badge-large"
              >PREDICTED</span
            >
          </div>
          <h2 class="modal-headline">{{ selectedNews.headline }}</h2>
          <p class="modal-description">{{ selectedNews.description }}</p>
          <div class="modal-progress">
            {{ selectedNews.minedPercent.toFixed(2) }}% of BTC mined at this
            point
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.news-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(247, 147, 26, 0.2);
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.date-label {
  font-size: 1.2em;
}

.date-value {
  font-size: 1.4em;
  font-weight: bold;
  color: #f7931a;
  font-family: "Courier New", monospace;
}

.news-ticker {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.news-ticker:hover {
  background: rgba(247, 147, 26, 0.1);
  transform: translateX(3px);
}

.ticker-label {
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.ticker-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.ticker-emoji {
  font-size: 1.2em;
}

.ticker-headline {
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.future-badge {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65em;
  font-weight: bold;
}

.recent-news {
  margin-top: 8px;
}

.news-summary {
  cursor: pointer;
  color: #888;
  font-size: 0.85em;
  padding: 4px;
  user-select: none;
}

.news-summary:hover {
  color: #f7931a;
}

.news-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.news-item:hover {
  background: rgba(247, 147, 26, 0.1);
  transform: translateX(3px);
}

.news-item.future-event {
  border-left: 3px solid #9b59b6;
}

.news-emoji {
  font-size: 1.3em;
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.news-year {
  font-size: 0.75em;
  color: #888;
}

.news-headline {
  font-size: 0.85em;
  color: #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-news {
  text-align: center;
  color: #666;
  font-size: 0.8em;
  padding: 4px;
}

/* Modal Styles */
.news-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.news-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #f7931a;
  border-radius: 16px;
  padding: 24px;
  max-width: 450px;
  width: 90%;
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.8em;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.modal-emoji {
  font-size: 3em;
  text-align: center;
  margin-bottom: 10px;
}

.modal-date {
  text-align: center;
  color: #f7931a;
  font-size: 0.9em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.future-badge-large {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: bold;
}

.modal-headline {
  text-align: center;
  color: #fff;
  font-size: 1.3em;
  margin-bottom: 15px;
  line-height: 1.3;
}

.modal-description {
  color: #aaa;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 15px;
}

.modal-progress {
  text-align: center;
  color: #666;
  font-size: 0.8em;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
