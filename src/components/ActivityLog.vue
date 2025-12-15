<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { events } = useGameState();
</script>

<template>
  <div class="bg-game-card rounded-xl p-4 mt-5 border border-game-border">
    <h3 class="m-0 mb-2.5 text-base text-gray-400">📋 Activity Log</h3>
    <div class="max-h-[120px] overflow-y-auto">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="py-1.5 border-b border-[#222] text-sm text-gray-400 last:border-b-0">
        {{ event }}
      </div>
    </div>
  </div>
</template>
