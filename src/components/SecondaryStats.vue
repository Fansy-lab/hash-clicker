<script setup lang="ts">
import { computed } from "vue";
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
  marketPrediction,
  upgrades,
} = useGameState();

const hasMarketIntel = computed(() => {
  return (
    upgrades.value.find((u: any) => u.id === "market-intel")?.purchased ?? false
  );
});
</script>

<template>
  <div
    class="rounded-xl p-4 sm:p-2.5 mb-5 sm:mb-4 border border-game-border bg-game-card/60">
    <div class="flex gap-4 sm:gap-2 mb-4 sm:mb-3 flex-wrap">
      <div
        class="flex-1 min-w-[100px] sm:min-w-[90px] flex flex-col items-center p-2.5 sm:p-2 rounded-lg stat-card">
        <span class="text-[0.65rem] text-gray-400 uppercase tracking-wide"
          >BTC Price</span
        >
        <span class="text-lg sm:text-base font-semibold text-white my-0.5"
          >${{ formatNumber(btcPrice) }}</span
        >
        <span
          class="text-xs font-medium"
          :class="marketTrend > 0 ? 'text-profit' : 'text-loss'">
          {{ marketTrend > 0 ? "▲" : "▼" }}
          {{ formatPercent(Math.abs(marketTrend)) }}
        </span>
        <!-- Market Intel prediction -->
        <span
          v-if="hasMarketIntel"
          class="text-[0.6rem] text-yellow-400/80 mt-1 italic text-center leading-tight">
          {{ marketPrediction.emoji }} {{ marketPrediction.hint }}
        </span>
      </div>

      <div
        class="flex-1 min-w-[100px] sm:min-w-[90px] flex flex-col items-center p-2.5 sm:p-2 rounded-lg stat-card">
        <span class="text-[0.65rem] text-gray-400 uppercase tracking-wide"
          >Difficulty</span
        >
        <span class="text-lg sm:text-base font-semibold text-white my-0.5">{{
          difficulty.toFixed(6)
        }}</span>
      </div>

      <div
        class="flex-1 min-w-[100px] sm:min-w-[90px] flex flex-col items-center p-2.5 sm:p-2 rounded-lg stat-card">
        <span class="text-[0.65rem] text-gray-400 uppercase tracking-wide"
          >Block Reward</span
        >
        <span class="text-lg sm:text-base font-semibold text-white my-0.5"
          >{{ currentBlockReward.toFixed(4) }} BTC</span
        >
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-1 gap-5 sm:gap-3">
      <div class="p-2.5 sm:p-2 rounded-lg stat-card">
        <div class="flex justify-between text-sm sm:text-xs mb-2 text-gray-300">
          <span>⏱️ Halving #{{ halvingCount + 1 }}</span>
          <span>{{ progressToHalving.toFixed(1) }}%</span>
        </div>
        <div class="progress-bar-container">
          <div
            class="progress-fill-halving"
            :style="{ width: progressToHalving + '%' }"></div>
        </div>
      </div>

      <div class="p-2.5 sm:p-2 rounded-lg stat-card">
        <div class="flex justify-between text-sm sm:text-xs mb-2 text-gray-300">
          <span>🌍 Global Mined</span>
          <span>{{ formatPercent(progressToCap) }}</span>
        </div>
        <div class="progress-bar-container">
          <div
            class="progress-fill-global"
            :style="{ width: Math.min(progressToCap, 100) + '%' }"></div>
        </div>
        <div class="text-xs sm:text-[0.65rem] text-gray-400 text-center mt-1.5">
          {{ formatBTC(globalBitcoinMined) }} /
          {{ formatNumber(MAX_BITCOIN) }} BTC
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth number transitions */
span {
  transition: all 0.4s ease-out;
}
</style>
