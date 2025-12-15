<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatTime } from "@/utils/formatters";

const { stats } = useGameState();
</script>

<template>
  <div class="tab-content">
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Total Clicks</span>
        <span class="stat-value">{{ stats.totalClicks.toLocaleString() }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total BTC Earned</span>
        <span class="stat-value">{{ formatBTC(stats.totalBTCEarned) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total BTC Spent</span>
        <span class="stat-value">{{ formatBTC(stats.totalBTCSpent) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Rigs Bought</span>
        <span class="stat-value">{{ stats.rigsBought }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Upgrades Bought</span>
        <span class="stat-value">{{ stats.upgradesBought }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Achievements</span>
        <span class="stat-value">{{ stats.achievementsUnlocked }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Prestige Resets</span>
        <span class="stat-value">{{ stats.prestigeResets }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Peak BTC</span>
        <span class="stat-value">{{ formatBTC(stats.peakBTC) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Play Time</span>
        <span class="stat-value">{{ formatTime(stats.playTime) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  max-height: 400px;
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  background: #1e1e32;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.stat-label {
  display: block;
  color: #888;
  font-size: 0.85em;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 1.3em;
  font-weight: bold;
  color: #f7931a;
}
</style>
