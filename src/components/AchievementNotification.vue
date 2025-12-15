<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { achievementNotification } = useGameState();
</script>

<template>
  <Transition name="slide">
    <div v-if="achievementNotification" class="achievement-popup">
      <div class="popup-icon">🏆</div>
      <div class="popup-content">
        <div class="popup-title">Achievement Unlocked!</div>
        <div class="popup-name">{{ achievementNotification.name }}</div>
        <div class="popup-reward">
          +{{ achievementNotification.reward }} BTC
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.achievement-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%);
  border: 2px solid #ffd700;
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3);
  z-index: 1000;
}

.popup-icon {
  font-size: 2.5em;
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.popup-content {
  text-align: left;
}

.popup-title {
  font-size: 0.85em;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.popup-name {
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  margin: 5px 0;
}

.popup-reward {
  color: #2ed573;
  font-weight: bold;
}

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
