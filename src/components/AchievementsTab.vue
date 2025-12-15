<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { achievements } = useGameState();
</script>

<template>
  <div class="max-h-[400px] overflow-y-auto">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
      <div
        v-for="ach in achievements"
        :key="ach.id"
        class="flex flex-col items-center text-center gap-1.5 py-3 px-2.5 bg-[#1e1e32] rounded-lg border transition-all duration-200"
        :class="
          ach.unlocked
            ? 'opacity-100 border-bitcoin-light bg-gradient-to-br from-[#1e1e32] to-[#2a2a35]'
            : 'opacity-50 border-game-border'
        ">
        <div class="text-2xl">{{ ach.unlocked ? "🏆" : "🔒" }}</div>
        <div class="flex-1">
          <div class="font-bold text-sm mb-0.5">{{ ach.name }}</div>
          <div class="text-gray-400 text-xs mb-1">{{ ach.description }}</div>
          <div class="text-bitcoin text-xs">Reward: {{ ach.reward }} BTC</div>
        </div>
      </div>
    </div>
  </div>
</template>
