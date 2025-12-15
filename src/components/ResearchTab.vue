<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC } from "@/utils/formatters";

const { bitcoin, availableResearch, activeResearch, startResearch } =
  useGameState();
</script>

<template>
  <div class="max-h-[400px] overflow-y-auto">
    <div class="grid gap-2.5">
      <div
        v-for="res in availableResearch"
        :key="res.id"
        class="rounded-xl p-4 border transition-all duration-200"
        :class="{
          'opacity-60 border-profit bg-[#1e1e32]': res.completed,
          'border-blue-500 bg-gradient-to-br from-[#1e1e32] to-[#1e2840]':
            activeResearch === res.id,
          'border-blue-500/30 bg-gradient-to-br from-[#1e1e32] to-[#1e2832]':
            !res.completed && activeResearch !== res.id && bitcoin >= res.cost,
          'border-game-border bg-[#1e1e32]':
            !res.completed && activeResearch !== res.id && bitcoin < res.cost,
        }">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-lg">{{ res.name }}</span>
          <span
            v-if="res.completed"
            class="bg-profit text-black py-0.5 px-2 rounded-full text-xs font-bold"
            >✓</span
          >
          <span v-else-if="activeResearch === res.id" class="animate-pulse"
            >🔬</span
          >
        </div>
        <div class="text-gray-400 text-sm mb-3">{{ res.effect }}</div>

        <div v-if="activeResearch === res.id && !res.completed" class="mb-2.5">
          <div class="h-2 bg-game-border rounded overflow-hidden mb-1.5">
            <div
              class="h-full rounded transition-all duration-300 bg-gradient-to-r from-blue-500 to-profit"
              :style="{
                width: (res.progress / res.researchTime) * 100 + '%',
              }"></div>
          </div>
          <div class="text-center text-sm text-blue-400">
            {{ ((res.progress / res.researchTime) * 100).toFixed(1) }}%
          </div>
        </div>

        <button
          v-if="!res.completed && activeResearch !== res.id"
          class="w-full py-2.5 rounded-md text-white cursor-pointer transition-all duration-200 border-none bg-gradient-to-br from-game-hover to-game-hoverLight hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="bitcoin < res.cost || activeResearch !== null"
          @click="startResearch(res)">
          Research: {{ formatBTC(res.cost) }} BTC
        </button>
      </div>
    </div>
  </div>
</template>
