<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatTime } from "@/utils/formatters";

const { stats } = useGameState();
</script>

<template>
  <div class="max-h-[400px] overflow-y-auto">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Total Clicks</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          stats.totalClicks.toLocaleString()
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Total BTC Earned</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          formatBTC(stats.totalBTCEarned)
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Total BTC Spent</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          formatBTC(stats.totalBTCSpent)
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Rigs Bought</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          stats.rigsBought
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Upgrades Bought</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          stats.upgradesBought
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Achievements</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          stats.achievementsUnlocked
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Prestige Resets</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          stats.prestigeResets
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Peak BTC</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          formatBTC(stats.peakBTC)
        }}</span>
      </div>
      <div class="bg-[#1e1e32] rounded-xl p-4 text-center">
        <span class="block text-gray-400 text-sm mb-2">Play Time</span>
        <span class="block text-xl font-bold text-bitcoin">{{
          formatTime(stats.playTime)
        }}</span>
      </div>
    </div>
  </div>
</template>
