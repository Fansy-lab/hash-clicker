<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatNumber } from "@/utils/formatters";

const {
  bitcoin,
  availableRigs,
  lockedRigsCount,
  nextLockedRig,
  totalMinedEver,
  getRigCost,
  buyRig,
  poolMining,
  togglePool,
  upgrades,
} = useGameState();

const hasPoolAccess = () => {
  return upgrades.value.find((u) => u.id === "pool-access")?.purchased ?? false;
};
</script>

<template>
  <div class="max-h-[400px] overflow-y-auto">
    <div
      v-if="hasPoolAccess()"
      class="flex items-center gap-4 mb-4 p-2.5 bg-[#1e1e32] rounded-lg">
      <button
        class="py-2.5 px-5 rounded-lg text-white cursor-pointer transition-all duration-200 border-none"
        :class="
          poolMining
            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
            : 'bg-game-hover'
        "
        @click="togglePool">
        {{ poolMining ? "🏊 Pool Mining ON" : "⛏️ Solo Mining" }}
      </button>
      <span class="text-gray-400 text-sm">Pool: +20% power, -2% fee</span>
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
      <div
        v-for="rig in availableRigs"
        :key="rig.id"
        class="rounded-lg p-2.5 border border-game-border transition-all duration-200 flex flex-col gap-1.5"
        :class="
          bitcoin >= getRigCost(rig)
            ? 'border-bitcoin/30 bg-gradient-to-br from-[#1e1e32] to-[#2a2a40]'
            : 'bg-[#1e1e32]'
        ">
        <div class="flex justify-between items-center">
          <span class="font-bold text-sm">{{ rig.name }}</span>
          <span class="bg-bitcoin py-0.5 px-2 rounded-full text-xs"
            >x{{ rig.count }}</span
          >
        </div>
        <div class="flex gap-2.5 text-xs text-gray-400">
          <span>⚡ {{ formatNumber(rig.hashPower) }} H/s</span>
          <span>💡 {{ formatBTC(rig.electricityCost) }}/s</span>
        </div>
        <button
          class="w-full py-2 rounded-md text-white text-xs cursor-pointer transition-all duration-200 border-none bg-gradient-to-br from-game-hover to-game-hoverLight hover:from-bitcoin hover:to-bitcoin-dark disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="bitcoin < getRigCost(rig)"
          @click="buyRig(rig)">
          Buy: {{ formatBTC(getRigCost(rig)) }} BTC
        </button>
      </div>

      <!-- Next locked rig -->
      <div
        v-if="nextLockedRig"
        class="rounded-lg p-2.5 border border-[#444] transition-all duration-200 flex flex-col gap-1.5 opacity-50 bg-gradient-to-br from-[#1a1a28] to-[#222235]">
        <div class="flex justify-between items-center">
          <span class="font-bold text-sm text-gray-400"
            >🔒 {{ nextLockedRig.name }}</span
          >
        </div>
        <div class="flex gap-2.5 text-xs text-gray-400">
          <span>⚡ {{ formatNumber(nextLockedRig.hashPower) }} H/s</span>
          <span>💡 {{ formatBTC(nextLockedRig.electricityCost) }}/s</span>
        </div>
        <div
          class="text-xs text-gray-400 py-1.5 px-2 bg-black/20 rounded text-center">
          {{ formatNumber(totalMinedEver) }} /
          {{ formatNumber(nextLockedRig.unlockAt) }} BTC
        </div>
      </div>

      <!-- More rigs indicator -->
      <div
        v-if="lockedRigsCount > 1"
        class="flex items-center justify-center p-2.5 bg-white/[0.02] rounded-lg border border-dashed border-[#444]">
        <span class="text-xs text-gray-500"
          >+{{ lockedRigsCount - 1 }} more</span
        >
      </div>
    </div>
  </div>
</template>
