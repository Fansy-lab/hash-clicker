<script setup lang="ts">
import { computed } from "vue";
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatNumber, formatUSD } from "@/utils/formatters";

const {
  bitcoin,
  usdBalance,
  btcPrice,
  mineClick,
  sellBTC,
  sellAllBTC,
  effectiveClickPower,
  effectiveDifficulty,
  effectiveBlockReward,
  INITIAL_BLOCK_REWARD,
  miningRate,
  netProfitUSD,
  hashRate,
  electricityCostPerSecond,
  activeEvent,
  eventTimer,
  prestigeLevel,
  poolMining,
  togglePool,
  upgrades,
} = useGameState();

const clickPowerBTC = () => {
  const base =
    (effectiveClickPower.value / (effectiveDifficulty.value * 50)) *
    (effectiveBlockReward.value / INITIAL_BLOCK_REWARD);
  return poolMining.value ? base * 0.98 : base;
};

const hasPoolAccess = computed(() => {
  return (
    upgrades.value.find((u: any) => u.id === "pool-access")?.purchased ?? false
  );
});

// Calculate interest rate based on debt
const interestRate = computed(() => {
  if (usdBalance.value >= 0) return 0;
  const debt = Math.abs(usdBalance.value);
  let rate = 3; // 3% base
  if (debt > 1000) rate += 2;
  if (debt > 10000) rate += 3;
  if (debt > 100000) rate += 5;
  if (debt > 1000000) rate += 10;
  if (debt > 10000000) rate += 15;
  return rate;
});
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
            >{{
              formatBTC(poolMining ? miningRate * 0.98 : miningRate)
            }}/s</span
          >
        </div>
      </div>
      <div class="stat-card flex items-center gap-2">
        <span class="text-lg">💡</span>
        <div class="flex flex-col">
          <span class="text-[0.6rem] text-gray-400 uppercase tracking-wide"
            >Power Cost</span
          >
          <span class="text-sm font-semibold text-white"
            >{{ formatUSD(electricityCostPerSecond) }}/s</span
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
              netProfitUSD > 0
                ? 'text-profit'
                : netProfitUSD < 0
                ? 'text-loss'
                : 'text-white'
            "
            >{{ formatUSD(netProfitUSD) }}/s</span
          >
        </div>
      </div>
      <!-- Pool Mining Toggle -->
      <button
        v-if="hasPoolAccess"
        @click="togglePool"
        class="stat-card flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 col-span-2 md:col-span-1"
        :class="
          poolMining
            ? 'ring-2 ring-bitcoin/50 bg-bitcoin/10'
            : 'hover:bg-white/5'
        ">
        <span class="text-lg">{{ poolMining ? "⛏️" : "👤" }}</span>
        <div class="flex flex-col items-start">
          <span class="text-[0.6rem] text-gray-400 uppercase tracking-wide"
            >Mining Pool</span
          >
          <span class="text-sm font-semibold flex items-center gap-1.5">
            <span :class="poolMining ? 'text-bitcoin' : 'text-gray-500'">
              {{ poolMining ? "ON" : "OFF" }}
            </span>
            <span v-if="poolMining" class="text-[0.6rem] text-gray-500">
              <span class="text-green-400">+20% H/s</span>
              <span class="text-red-400">-2%₿</span>
            </span>
            <span v-else class="text-[0.6rem] text-gray-500 italic"
              >tap to join</span
            >
          </span>
        </div>
      </button>
    </div>

    <!-- Center: Balances + Mine Button -->
    <div
      class="flex flex-col items-center justify-center text-center order-first md:order-none">
      <!-- BTC Balance -->
      <div class="flex flex-col items-center mb-2">
        <span class="text-xs text-gray-400 uppercase tracking-wider"
          >₿ Balance</span
        >
        <span
          class="text-4xl sm:text-3xl font-bold text-gradient-bitcoin leading-tight select-text"
          >{{ formatBTC(bitcoin) }}</span
        >
        <span class="text-sm text-gray-400"
          >≈ {{ formatUSD(bitcoin * btcPrice) }}</span
        >
      </div>

      <!-- USD Balance & Sell Section -->
      <div
        class="w-full max-w-[260px] mb-4 rounded-xl overflow-hidden border"
        :class="
          usdBalance < 0
            ? 'border-red-500/50 bg-gradient-to-b from-red-900/20 to-red-900/5'
            : 'border-green-500/30 bg-gradient-to-b from-green-900/20 to-green-900/5'
        ">
        <div
          class="flex items-center justify-between px-3 py-2"
          :class="usdBalance < 0 ? 'bg-red-500/10' : 'bg-green-500/10'">
          <span
            class="text-xs uppercase tracking-wider font-medium"
            :class="usdBalance < 0 ? 'text-red-300/80' : 'text-green-300/80'"
            >{{ usdBalance < 0 ? "🔴 DEBT" : "💵 Cash" }}</span
          >
          <span
            class="text-xl font-bold"
            :class="usdBalance < 0 ? 'text-red-400' : 'text-green-400'"
            >{{ formatUSD(usdBalance) }}</span
          >
        </div>
        <!-- Interest rate warning when in debt -->
        <div
          v-if="usdBalance < 0"
          class="px-3 py-1.5 bg-red-500/20 border-t border-red-500/30 flex items-center justify-between">
          <span class="text-xs text-red-300">📈 Interest Rate:</span>
          <span class="text-sm font-bold text-red-400 animate-pulse"
            >{{ interestRate }}%/sec</span
          >
        </div>
        <div class="p-2 bg-black/20">
          <div class="text-[0.65rem] text-gray-500 text-center mb-1.5">
            Sell BTC @ {{ formatUSD(btcPrice) }}/BTC
          </div>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              class="py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-b from-bitcoin to-bitcoin-dark hover:from-bitcoin-light hover:to-bitcoin border border-bitcoin-dark/50 shadow-sm hover:shadow-bitcoin/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              :disabled="bitcoin < 0.1"
              @click="sellBTC(0.1)">
              <span class="block text-white">0.1 ₿</span>
              <span class="block text-[0.6rem] text-white/70">{{
                formatUSD(0.1 * btcPrice)
              }}</span>
            </button>
            <button
              class="py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-b from-bitcoin to-bitcoin-dark hover:from-bitcoin-light hover:to-bitcoin border border-bitcoin-dark/50 shadow-sm hover:shadow-bitcoin/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              :disabled="bitcoin < 1"
              @click="sellBTC(1)">
              <span class="block text-white">1 ₿</span>
              <span class="block text-[0.6rem] text-white/70">{{
                formatUSD(1 * btcPrice)
              }}</span>
            </button>
            <button
              class="py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-800/50 shadow-sm hover:shadow-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              :disabled="bitcoin <= 0"
              @click="sellAllBTC()">
              <span class="block text-white">ALL</span>
              <span class="block text-[0.6rem] text-white/70">{{
                formatUSD(bitcoin * btcPrice)
              }}</span>
            </button>
          </div>
        </div>
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
        class="stat-card text-center border border-green-500/20 bg-gradient-to-br from-green-500/15 to-green-500/5">
        <span
          class="block text-[0.6rem] text-gray-400 uppercase tracking-wide mb-1"
          >BTC Portfolio Value</span
        >
        <span class="block text-lg font-semibold text-white">{{
          formatUSD(bitcoin * btcPrice)
        }}</span>
        <span class="block text-xs text-gray-400 mt-0.5"
          >@ {{ formatUSD(btcPrice) }}/BTC</span
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
            netProfitUSD > 0
              ? 'text-profit'
              : netProfitUSD < 0
              ? 'text-loss'
              : 'text-white'
          "
          >{{ formatUSD(netProfitUSD * 3600) }}</span
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
