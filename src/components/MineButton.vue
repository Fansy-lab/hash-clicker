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
  <div class="text-center mb-5">
    <button
      class="btn-mine w-[150px] h-[150px] mx-auto mb-4"
      @click="mineClick">
      <span class="text-5xl">⛏️</span>
      <span class="text-lg font-bold text-white mt-1">MINE</span>
    </button>
    <div class="text-gray-400 text-sm">
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
