<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC } from "@/utils/formatters";

const {
  mineClick,
  effectiveClickPower,
  effectiveDifficulty,
  effectiveBlockReward,
  INITIAL_BLOCK_REWARD,
} = useGameState();
</script>

<template>
  <div class="mine-section">
    <button class="mine-btn" @click="mineClick">
      <span class="mine-icon">⛏️</span>
      <span class="mine-text">MINE</span>
    </button>
    <div class="click-power">
      Click Power:
      {{
        formatBTC(
          (effectiveClickPower / (effectiveDifficulty * 100)) *
            (effectiveBlockReward / INITIAL_BLOCK_REWARD)
        )
      }}
      BTC
    </div>
  </div>
</template>

<style scoped>
.mine-section {
  text-align: center;
  margin-bottom: 20px;
}

.mine-btn {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f7931a, #c77b15);
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  transition: all 0.1s;
  box-shadow: 0 6px 20px rgba(247, 147, 26, 0.4);
  /* Mobile optimizations */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.mine-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(247, 147, 26, 0.6);
}

.mine-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
}

.mine-icon {
  font-size: 3em;
}

.mine-text {
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  margin-top: 5px;
}

.click-power {
  color: #888;
  font-size: 0.9em;
}
</style>
