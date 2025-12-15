<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { prestigeLevel, prestigePoints, prestigePointsOnReset, prestige } =
  useGameState();
</script>

<template>
  <div class="tab-content prestige-content">
    <div class="prestige-info">
      <div class="prestige-stat">
        <span class="label">Current Level</span>
        <span class="value">{{ prestigeLevel }}</span>
      </div>
      <div class="prestige-stat">
        <span class="label">Prestige Points</span>
        <span class="value">{{ prestigePoints }}</span>
      </div>
      <div class="prestige-stat">
        <span class="label">Points on Reset</span>
        <span class="value highlight">+{{ prestigePointsOnReset }}</span>
      </div>
    </div>

    <div class="prestige-bonuses">
      <h3>Prestige Bonuses</h3>
      <ul>
        <li>+5% hash power per level (base)</li>
        <li>+5% click power per level</li>
        <li>Keep prestige upgrades</li>
        <li>Halving progress preserved</li>
      </ul>
    </div>

    <div class="prestige-warning">
      <p>⚠️ Prestiging will reset:</p>
      <ul>
        <li>All BTC and mined amount</li>
        <li>All rigs</li>
        <li>All non-prestige upgrades</li>
        <li>All research</li>
      </ul>
    </div>

    <button
      class="prestige-btn"
      :disabled="prestigePointsOnReset < 1"
      @click="prestige">
      ⭐ PRESTIGE (+{{ prestigePointsOnReset }} points)
    </button>
  </div>
</template>

<style scoped>
.tab-content {
  max-height: 400px;
  overflow-y: auto;
}

.prestige-content {
  text-align: center;
}

.prestige-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.prestige-stat {
  text-align: center;
}

.prestige-stat .label {
  display: block;
  color: #888;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.prestige-stat .value {
  font-size: 2em;
  font-weight: bold;
  color: #9b59b6;
}

.prestige-stat .value.highlight {
  color: #2ed573;
}

.prestige-bonuses,
.prestige-warning {
  background: #1e1e32;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: left;
}

.prestige-bonuses h3 {
  color: #2ed573;
  margin-bottom: 10px;
}

.prestige-warning p {
  color: #ff6b6b;
  margin-bottom: 10px;
}

.prestige-bonuses ul,
.prestige-warning ul {
  margin: 0;
  padding-left: 20px;
  color: #aaa;
}

.prestige-bonuses li,
.prestige-warning li {
  margin-bottom: 5px;
}

.prestige-btn {
  padding: 15px 40px;
  font-size: 1.2em;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.prestige-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(155, 89, 182, 0.4);
}

.prestige-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
