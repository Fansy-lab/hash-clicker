<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatNumber } from "@/utils/formatters";

const {
  bitcoin,
  mineClick,
  effectiveClickPower,
  effectiveDifficulty,
  effectiveBlockReward,
  INITIAL_BLOCK_REWARD,
  miningRate,
  netProfit,
  hashRate,
  electricityDrain,
  activeEvent,
  eventTimer,
  prestigeLevel,
} = useGameState();

const clickPowerBTC = () => {
  return (
    (effectiveClickPower.value / (effectiveDifficulty.value * 50)) *
    (effectiveBlockReward.value / INITIAL_BLOCK_REWARD)
  );
};
</script>

<template>
  <div class="hero-section">
    <!-- Left: Stats summary -->
    <div class="stats-sidebar">
      <div class="stat-item">
        <span class="stat-icon">⚡</span>
        <div class="stat-info">
          <span class="stat-label">Hash Rate</span>
          <span class="stat-value">{{ formatNumber(hashRate) }} H/s</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📈</span>
        <div class="stat-info">
          <span class="stat-label">Mining</span>
          <span class="stat-value">{{ formatBTC(miningRate) }}/s</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💡</span>
        <div class="stat-info">
          <span class="stat-label">Power</span>
          <span class="stat-value"
            >-{{ formatBTC(electricityDrain / 100) }}/s</span
          >
        </div>
      </div>
      <div
        class="stat-item"
        :class="{ positive: netProfit > 0, negative: netProfit < 0 }">
        <span class="stat-icon">💰</span>
        <div class="stat-info">
          <span class="stat-label">Net Profit</span>
          <span class="stat-value">{{ formatBTC(netProfit) }}/s</span>
        </div>
      </div>
    </div>

    <!-- Center: Balance + Mine Button -->
    <div class="center-section">
      <div class="balance-display">
        <span class="balance-label">₿ Balance</span>
        <span class="balance-value">{{ formatBTC(bitcoin) }}</span>
        <span class="balance-unit">BTC</span>
      </div>

      <button class="mine-btn" @click="mineClick">
        <span class="mine-icon">⛏️</span>
        <span class="mine-text">MINE</span>
      </button>

      <div class="click-power">+{{ formatBTC(clickPowerBTC()) }} per click</div>

      <div v-if="activeEvent" class="event-badge">
        <div class="event-header">
          <span class="event-name">{{ activeEvent.name }}</span>
          <span v-if="eventTimer > 0" class="event-timer"
            >{{ (eventTimer / 10).toFixed(0) }}s</span
          >
        </div>
        <div class="event-description">{{ activeEvent.description }}</div>
      </div>

      <div v-if="prestigeLevel > 0" class="prestige-badge">
        ⭐ Level {{ prestigeLevel }}
      </div>
    </div>

    <!-- Right: Quick info -->
    <div class="info-sidebar">
      <div class="info-card earnings">
        <span class="info-label">Portfolio Value</span>
        <span class="info-value">${{ formatNumber(bitcoin * 100) }}</span>
      </div>
      <div class="info-card">
        <span class="info-label">Click Power</span>
        <span class="info-value">{{ formatBTC(clickPowerBTC()) }}</span>
      </div>
      <div
        class="info-card"
        :class="{ positive: netProfit > 0, negative: netProfit < 0 }">
        <span class="info-label">Hourly Est.</span>
        <span class="info-value">{{ formatBTC(netProfit * 3600) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid #f7931a33;
}

/* Left sidebar stats */
.stats-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: all 0.2s;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.stat-icon {
  font-size: 1.2em;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.7em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 0.95em;
  font-weight: 600;
  color: #fff;
}

.stat-item.positive .stat-value {
  color: #2ed573;
}

.stat-item.negative .stat-value {
  color: #ff4757;
}

/* Center section */
.center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.balance-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 0.85em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.balance-value {
  font-size: 2.5em;
  font-weight: bold;
  background: linear-gradient(135deg, #f7931a 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.balance-unit {
  font-size: 1em;
  color: #f7931a;
  font-weight: 600;
}

.mine-btn {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f7931a, #c77b15);
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  box-shadow: 0 6px 25px rgba(247, 147, 26, 0.5);
  /* Mobile optimizations */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.mine-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 30px rgba(247, 147, 26, 0.7);
}

.mine-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
}

.mine-icon {
  font-size: 2.5em;
}

.mine-text {
  font-size: 1em;
  font-weight: bold;
  color: #fff;
  margin-top: 2px;
}

.click-power {
  margin-top: 12px;
  color: #2ed573;
  font-size: 0.9em;
  font-weight: 500;
}

.event-badge {
  margin-top: 15px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  animation: pulse 1.5s infinite;
  max-width: 280px;
  text-align: center;
}

.event-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.event-name {
  font-size: 0.95em;
  font-weight: 700;
}

.event-timer {
  font-size: 0.85em;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.event-description {
  font-size: 0.8em;
  opacity: 0.9;
  line-height: 1.3;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

.prestige-badge {
  margin-top: 10px;
  padding: 5px 12px;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
}

/* Right sidebar */
.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.info-card {
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  text-align: center;
  transition: all 0.2s;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.06);
}

.info-card.earnings {
  background: linear-gradient(
    135deg,
    rgba(247, 147, 26, 0.15) 0%,
    rgba(247, 147, 26, 0.05) 100%
  );
  border: 1px solid rgba(247, 147, 26, 0.2);
}

.info-label {
  display: block;
  font-size: 0.7em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  display: block;
  font-size: 1.1em;
  font-weight: 600;
  color: #fff;
}

.info-card.positive .info-value {
  color: #2ed573;
}

.info-card.negative .info-value {
  color: #ff4757;
}

/* Responsive */
@media (max-width: 700px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }

  .stats-sidebar,
  .info-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .center-section {
    order: -1;
  }

  .balance-value {
    font-size: 2em;
  }

  .mine-btn {
    width: 100px;
    height: 100px;
  }

  .mine-icon {
    font-size: 2em;
  }

  .mine-text {
    font-size: 0.85em;
  }
}

@media (max-width: 400px) {
  .hero-section {
    padding: 12px;
    gap: 12px;
  }

  .stats-sidebar,
  .info-sidebar {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .stat-item {
    padding: 6px 8px;
    gap: 6px;
  }

  .stat-icon {
    font-size: 1em;
  }

  .stat-label {
    font-size: 0.6em;
  }

  .stat-value {
    font-size: 0.8em;
  }

  .info-card {
    padding: 8px 10px;
  }

  .info-label {
    font-size: 0.6em;
  }

  .info-value {
    font-size: 0.9em;
  }

  .balance-display {
    margin-bottom: 15px;
  }

  .balance-label {
    font-size: 0.75em;
  }

  .balance-value {
    font-size: 1.6em;
  }

  .balance-unit {
    font-size: 0.85em;
  }

  .mine-btn {
    width: 90px;
    height: 90px;
  }

  .mine-icon {
    font-size: 1.8em;
  }

  .click-power {
    font-size: 0.8em;
    margin-top: 10px;
  }

  .event-badge {
    padding: 10px 14px;
    max-width: 240px;
  }

  .event-name {
    font-size: 0.85em;
  }

  .event-description {
    font-size: 0.75em;
  }
}
</style>
