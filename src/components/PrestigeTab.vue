<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { prestigeLevel, prestigePoints, prestigePointsOnReset, prestige } =
  useGameState();
</script>

<template>
  <div class="max-h-[400px] overflow-y-auto text-center">
    <div class="flex justify-center gap-8 mb-6 flex-wrap">
      <div class="text-center">
        <span class="block text-gray-400 text-sm mb-1.5">Current Level</span>
        <span class="text-4xl font-bold text-purple-500">{{
          prestigeLevel
        }}</span>
      </div>
      <div class="text-center">
        <span class="block text-gray-400 text-sm mb-1.5">Prestige Points</span>
        <span class="text-4xl font-bold text-purple-500">{{
          prestigePoints
        }}</span>
      </div>
      <div class="text-center">
        <span class="block text-gray-400 text-sm mb-1.5">Points on Reset</span>
        <span class="text-4xl font-bold text-profit"
          >+{{ prestigePointsOnReset }}</span
        >
      </div>
    </div>

    <div class="bg-[#1e1e32] rounded-xl p-4 mb-5 text-left">
      <h3 class="text-profit mb-2.5">Prestige Bonuses</h3>
      <ul class="m-0 pl-5 text-gray-400">
        <li class="mb-1.5">+5% hash power per level (base)</li>
        <li class="mb-1.5">+5% click power per level</li>
        <li class="mb-1.5">Keep prestige upgrades</li>
        <li class="mb-1.5">Halving progress preserved</li>
      </ul>
    </div>

    <div class="bg-[#1e1e32] rounded-xl p-4 mb-5 text-left">
      <p class="text-loss mb-2.5">⚠️ Prestiging will reset:</p>
      <ul class="m-0 pl-5 text-gray-400">
        <li class="mb-1.5">All BTC and mined amount</li>
        <li class="mb-1.5">All rigs</li>
        <li class="mb-1.5">All non-prestige upgrades</li>
        <li class="mb-1.5">All research</li>
      </ul>
    </div>

    <button
      class="py-4 px-10 text-xl rounded-xl text-white cursor-pointer transition-all duration-200 border-none bg-gradient-to-br from-purple-600 to-purple-700 hover:scale-105 hover:shadow-[0_5px_20px_rgba(155,89,182,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      :disabled="prestigePointsOnReset < 1"
      @click="prestige">
      ⭐ PRESTIGE (+{{ prestigePointsOnReset }} points)
    </button>
  </div>
</template>
