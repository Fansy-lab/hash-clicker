<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatNumber, formatPercent } from "@/utils/formatters";

const {
  btcPrice,
  marketTrend,
  difficulty,
  currentBlockReward,
  halvingCount,
  progressToHalving,
  globalBitcoinMined,
  progressToCap,
  MAX_BITCOIN,
} = useGameState();
</script>

<template>
  <div class="secondary-stats">
    <div class="stats-row">
      <div class="stat-chip">
        <span class="chip-label">BTC Price</span>
        <span class="chip-value">${{ formatNumber(btcPrice) }}</span>
        <span
          class="chip-trend"
          :class="{ up: marketTrend > 0, down: marketTrend < 0 }">
          {{ marketTrend > 0 ? "▲" : "▼" }}
          {{ formatPercent(Math.abs(marketTrend)) }}
        </span>
      </div>

      <div class="stat-chip">
        <span class="chip-label">Difficulty</span>
        <span class="chip-value">{{ difficulty.toFixed(6) }}</span>
      </div>

      <div class="stat-chip">
        <span class="chip-label">Block Reward</span>
        <span class="chip-value">{{ currentBlockReward.toFixed(4) }} BTC</span>
      </div>
    </div>

    <div class="progress-row">
      <div class="progress-item">
        <div class="progress-header">
          <span>⏱️ Halving #{{ halvingCount + 1 }}</span>
          <span>{{ progressToHalving.toFixed(1) }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill halving"
            :style="{ width: progressToHalving + '%' }"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="progress-header">
          <span>🌍 Global Mined</span>
          <span>{{ formatPercent(progressToCap / 100) }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill global"
            :style="{ width: Math.min(progressToCap, 100) + '%' }"></div>
        </div>
        <div class="progress-detail">
          {{ formatBTC(globalBitcoinMined) }} /
          {{ formatNumber(MAX_BITCOIN) }} BTC
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.secondary-stats {
  background: rgba(26, 26, 46, 0.6);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #333;
}

.stats-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.stat-chip {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.chip-label {
  font-size: 0.7em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chip-value {
  font-size: 1.1em;
  font-weight: 600;
  color: #fff;
  margin: 3px 0;
}

.chip-trend {
  font-size: 0.8em;
  font-weight: 500;
}

.chip-trend.up {
  color: #2ed573;
}

.chip-trend.down {
  color: #ff4757;
}

.progress-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.progress-item {
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  margin-bottom: 8px;
  color: #ccc;
}

.progress-bar {
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.halving {
  background: linear-gradient(90deg, #f7931a, #ffd700);
}

.progress-fill.global {
  background: linear-gradient(90deg, #2ed573, #7bed9f);
}

.progress-detail {
  font-size: 0.75em;
  color: #888;
  text-align: center;
  margin-top: 5px;
}

@media (max-width: 600px) {
  .progress-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 400px) {
  .secondary-stats {
    padding: 10px;
    margin-bottom: 15px;
  }

  .stats-row {
    gap: 8px;
    margin-bottom: 12px;
  }

  .stat-chip {
    min-width: 90px;
    padding: 8px;
  }

  .chip-label {
    font-size: 0.6em;
  }

  .chip-value {
    font-size: 0.9em;
  }

  .chip-trend {
    font-size: 0.7em;
  }

  .progress-item {
    padding: 8px;
  }

  .progress-header {
    font-size: 0.75em;
    margin-bottom: 6px;
  }

  .progress-bar {
    height: 6px;
  }

  .progress-detail {
    font-size: 0.65em;
  }
}
</style>
