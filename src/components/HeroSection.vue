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
  <div
    class="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-5 p-4 md:p-5 rounded-2xl mb-5 border border-bitcoin/20 bg-gradient-to-br from-game-card to-game-cardDark">
    <!-- Left: Stats summary -->
    <div
      class="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 justify-center order-1 md:order-none">
      <div class="stat-card flex items-center gap-2">
        <span class="text-lg">⚡</span>
        <div class="flex flex-col">
          <span class="text-[0.6rem] text-gray-400 uppercase tracking-wide"
            >Hash Rate</span
          >
          <span class="text-sm font-semibold text-white"
            >{{ formatNumber(hashRate) }} H/s</span
          >
        </div>
      </div>
      <div class="stat-card flex items-center gap-2">
        <span class="text-lg">📈</span>
        <div class="flex flex-col">
          <span class="text-[0.6rem] text-gray-400 uppercase tracking-wide"
            >Mining</span
          >
          <span class="text-sm font-semibold text-white"
            >{{ formatBTC(miningRate) }}/s</span
          >
        </div>
      </div>
      <div class="stat-card flex items-center gap-2">
        <span class="text-lg">💡</span>
        <div class="flex flex-col">
          <span class="text-[0.6rem] text-gray-400 uppercase tracking-wide"
            >Power</span
          >
          <span class="text-sm font-semibold text-white"
            >-{{ formatBTC(electricityDrain / 100) }}/s</span
          >
        </div>
      </div>
      <div class="stat-card flex items-center gap-2">
        <span class="text-lg">💰</span>
        <div class="flex flex-col">
          <span class="text-[0.6rem] text-gray-400 uppercase tracking-wide"
            >Net Profit</span
          >
          <span
            class="text-sm font-semibold"
            :class="
              netProfit > 0
                ? 'text-profit'
                : netProfit < 0
                ? 'text-loss'
                : 'text-white'
            "
            >{{ formatBTC(netProfit) }}/s</span
          >
        </div>
      </div>
    </div>

    <!-- Center: Balance + Mine Button -->
    <div
      class="flex flex-col items-center justify-center text-center order-first md:order-none">
      <div class="flex flex-col items-center mb-4">
        <span class="text-xs text-gray-400 uppercase tracking-wider"
          >₿ Balance</span
        >
        <span
          class="text-4xl sm:text-3xl font-bold text-gradient-bitcoin leading-tight select-text"
          >{{ formatBTC(bitcoin) }}</span
        >
        <span class="text-base font-semibold text-bitcoin">BTC</span>
      </div>

      <button class="btn-mine" @click="mineClick">
        <span class="text-4xl">⛏️</span>
        <span class="text-sm font-bold text-white mt-0.5">MINE</span>
      </button>

      <div class="mt-3 text-profit text-sm font-medium">
        +{{ formatBTC(clickPowerBTC()) }} per click
      </div>

      <div
        v-if="activeEvent"
        class="mt-4 py-3 px-4 rounded-xl flex flex-col gap-1 items-center animate-pulse max-w-[280px] text-center bg-gradient-to-br from-purple-600 to-purple-700">
        <div class="flex gap-2.5 items-center">
          <span class="text-sm font-bold">{{ activeEvent.name }}</span>
          <span
            v-if="eventTimer > 0"
            class="text-xs bg-black/20 py-0.5 px-2 rounded-full"
            >{{ (eventTimer / 10).toFixed(0) }}s</span
          >
        </div>
        <div class="text-xs opacity-90 leading-tight">
          {{ activeEvent.description }}
        </div>
      </div>

      <div
        v-if="prestigeLevel > 0"
        class="mt-2.5 py-1 px-3 rounded-full text-sm font-semibold bg-gradient-to-br from-purple-600 to-purple-700">
        ⭐ Level {{ prestigeLevel }}
      </div>
    </div>

    <!-- Right: Quick info -->
    <div
      class="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 justify-center order-2 md:order-none">
      <div
        class="stat-card text-center border border-bitcoin/20 bg-gradient-to-br from-bitcoin/15 to-bitcoin/5">
        <span
          class="block text-[0.6rem] text-gray-400 uppercase tracking-wide mb-1"
          >Portfolio Value</span
        >
        <span class="block text-lg font-semibold text-white"
          >${{ formatNumber(bitcoin * 100) }}</span
        >
      </div>
      <div class="stat-card text-center">
        <span
          class="block text-[0.6rem] text-gray-400 uppercase tracking-wide mb-1"
          >Click Power</span
        >
        <span class="block text-lg font-semibold text-white">{{
          formatBTC(clickPowerBTC())
        }}</span>
      </div>
      <div class="stat-card text-center md:col-span-1 col-span-2">
        <span
          class="block text-[0.6rem] text-gray-400 uppercase tracking-wide mb-1"
          >Hourly Est.</span
        >
        <span
          class="block text-lg font-semibold"
          :class="
            netProfit > 0
              ? 'text-profit'
              : netProfit < 0
              ? 'text-loss'
              : 'text-white'
          "
          >{{ formatBTC(netProfit * 3600) }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional mobile tweaks */
@media (max-width: 400px) {
  .btn-mine {
    @apply w-[90px] h-[90px];
  }
  .btn-mine span:first-child {
    @apply text-3xl;
  }
}
</style>
