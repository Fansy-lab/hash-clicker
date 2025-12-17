<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import {
  formatBTC,
  formatNumber,
  formatPercent,
  formatUSD,
} from "@/utils/formatters";

const {
  bitcoin,
  usdBalance,
  hashRate,
  electricityCostPerSecond,
  miningRate,
  netProfitUSD,
  effectiveBtcPrice,
  marketTrend,
  difficulty,
  currentBlockReward,
  halvingCount,
  progressToHalving,
  globalBitcoinMined,
  progressToCap,
  activeEvent,
  eventTimer,
  prestigeLevel,
  sellBTC,
  sellAllBTC,
  MAX_BITCOIN,
} = useGameState();
</script>

<template>
  <div class="stats-panel">
    <!-- BTC Balance -->
    <div class="stat main-balance">
      <span class="label">₿ Balance</span>
      <span class="value">{{ formatBTC(bitcoin) }} BTC</span>
      <span class="usd-value"
        >≈ {{ formatUSD(bitcoin * effectiveBtcPrice) }}</span
      >
    </div>

    <!-- USD Balance with Sell Buttons -->
    <div class="stat usd-balance">
      <span class="label">💵 USD Balance</span>
      <span class="value usd">{{ formatUSD(usdBalance) }}</span>
      <div class="sell-buttons">
        <button
          class="sell-btn"
          :disabled="bitcoin < 0.1"
          @click="sellBTC(0.1)">
          Sell 0.1 BTC
        </button>
        <button class="sell-btn" :disabled="bitcoin < 1" @click="sellBTC(1)">
          Sell 1 BTC
        </button>
        <button
          class="sell-btn sell-all"
          :disabled="bitcoin <= 0"
          @click="sellAllBTC()">
          Sell All
        </button>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat">
        <span class="label">Hash Rate</span>
        <span class="value">{{ formatNumber(hashRate) }} H/s</span>
      </div>
      <div class="stat">
        <span class="label">Power Cost</span>
        <span class="value">{{ formatUSD(electricityCostPerSecond) }}/s</span>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat">
        <span class="label">Mining Rate</span>
        <span class="value">{{ formatBTC(miningRate) }}/s</span>
      </div>
      <div
        class="stat"
        :class="{ negative: netProfitUSD < 0, positive: netProfitUSD > 0 }">
        <span class="label">Net Profit</span>
        <span class="value">{{ formatUSD(netProfitUSD) }}/s</span>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat">
        <span class="label">BTC Price</span>
        <span class="value">${{ formatNumber(effectiveBtcPrice) }}</span>
      </div>
      <div
        class="stat"
        :class="{ positive: marketTrend > 0, negative: marketTrend < 0 }">
        <span class="label">Trend</span>
        <span class="value"
          >{{ marketTrend > 0 ? "📈" : "📉" }}
          {{ formatPercent(marketTrend) }}</span
        >
      </div>
    </div>

    <div class="stat-row">
      <div class="stat">
        <span class="label">Difficulty</span>
        <span class="value">{{ formatNumber(difficulty) }}</span>
      </div>
      <div class="stat">
        <span class="label">Block Reward</span>
        <span class="value">{{ currentBlockReward.toFixed(8) }} BTC</span>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-label">
        <span>Halving #{{ halvingCount }}</span>
        <span>{{ progressToHalving.toFixed(1) }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill halving"
          :style="{ width: progressToHalving + '%' }"></div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-label">
        <span>Global BTC Mined</span>
        <span
          >{{ formatBTC(globalBitcoinMined) }} /
          {{ formatNumber(MAX_BITCOIN) }}</span
        >
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill cap"
          :style="{ width: progressToCap + '%' }"></div>
      </div>
      <div class="progress-percent">
        {{ formatPercent(progressToCap / 100) }} of cap
      </div>
    </div>

    <div v-if="activeEvent" class="event-display">
      <div class="event-name">{{ activeEvent.name }}</div>
      <div class="event-timer" v-if="eventTimer > 0">
        {{ (eventTimer / 10).toFixed(1) }}s remaining
      </div>
    </div>

    <div v-if="prestigeLevel > 0" class="prestige-indicator">
      ⭐ Prestige Level: {{ prestigeLevel }}
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #f7931a33;
}

.stat {
  text-align: center;
  padding: 10px;
}

.main-balance {
  background: linear-gradient(135deg, #f7931a22 0%, #f7931a11 100%);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.main-balance .value {
  font-size: 2em;
  color: #f7931a;
  font-weight: bold;
}

.main-balance .usd-value {
  display: block;
  font-size: 0.9em;
  color: #888;
  margin-top: 5px;
}

.usd-balance {
  background: linear-gradient(135deg, #2ed57322 0%, #2ed57311 100%);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.usd-balance .value.usd {
  font-size: 1.8em;
  color: #2ed573;
  font-weight: bold;
}

.sell-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: center;
}

.sell-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(135deg, #f7931a 0%, #e67e22 100%);
  color: white;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.2s;
}

.sell-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(247, 147, 26, 0.4);
}

.sell-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sell-btn.sell-all {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.stat .label {
  display: block;
  font-size: 0.8em;
  color: #888;
  margin-bottom: 5px;
}

.stat .value {
  font-size: 1.1em;
  color: #fff;
}

.stat.negative .value {
  color: #ff4757;
}

.stat.positive .value {
  color: #2ed573;
}

.progress-section {
  margin: 15px 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  margin-bottom: 5px;
  color: #aaa;
}

.progress-bar {
  height: 10px;
  background: #333;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s;
}

.progress-fill.halving {
  background: linear-gradient(90deg, #f7931a, #ffd700);
}

.progress-fill.cap {
  background: linear-gradient(90deg, #2ed573, #7bed9f);
}

.progress-percent {
  text-align: center;
  font-size: 0.75em;
  color: #888;
  margin-top: 5px;
}

.event-display {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  text-align: center;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.event-name {
  font-weight: bold;
  font-size: 1.1em;
}

.event-timer {
  font-size: 0.9em;
  opacity: 0.8;
}

.prestige-indicator {
  text-align: center;
  margin-top: 15px;
  padding: 10px;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border-radius: 8px;
  font-weight: bold;
}
</style>
