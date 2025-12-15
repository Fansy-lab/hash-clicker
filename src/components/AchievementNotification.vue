<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { achievementNotification } = useGameState();
</script>

<template>
  <Transition name="slide">
    <div
      v-if="achievementNotification"
      class="fixed bottom-5 right-5 bg-gradient-to-br from-game-hover to-game-card border-2 border-bitcoin-light rounded-xl py-4 px-5 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(255,215,0,0.3)] z-[1000]">
      <div class="text-4xl animate-bounce">🏆</div>
      <div class="text-left">
        <div class="text-xs text-bitcoin-light uppercase tracking-wider">
          Achievement Unlocked!
        </div>
        <div class="text-lg font-bold text-white my-1">
          {{ achievementNotification.name }}
        </div>
        <div class="text-profit font-bold">
          +{{ achievementNotification.reward }} BTC
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active {
  animation: slideIn 0.4s ease-out;
}

.slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
