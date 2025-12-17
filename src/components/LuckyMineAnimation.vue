<script setup lang="ts">
import { ref, watch } from "vue";
import { useGameState } from "@/composables/useGameState";
import { formatBTC } from "@/utils/formatters";

const { luckyMineNotifications } = useGameState();

// Local copy with positions
const activeNotifications = ref<
  Array<{
    id: number;
    multiplier: number;
    amount: number;
    x: number;
    y: number;
  }>
>([]);

const isMobile = ref(false);

// Check if device is mobile
const checkMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    window.innerWidth < 768 ||
    "ontouchstart" in window;
};

checkMobile();
window.addEventListener("resize", checkMobile);

// Track current mouse position
let currentMouseX = window.innerWidth / 2;
let currentMouseY = window.innerHeight / 2;

const updateMousePosition = (e: MouseEvent) => {
  currentMouseX = e.clientX;
  currentMouseY = e.clientY;
};

window.addEventListener("mousemove", updateMousePosition);

// Watch for new notifications
watch(
  luckyMineNotifications,
  (notifications) => {
    // Find new notifications that we don't have yet
    for (const notification of notifications) {
      if (!activeNotifications.value.find((n) => n.id === notification.id)) {
        // New notification - add with current mouse position
        const x = isMobile.value ? window.innerWidth / 2 : currentMouseX;
        const y = isMobile.value ? window.innerHeight / 2 : currentMouseY;

        activeNotifications.value.push({
          ...notification,
          x,
          y,
        });

        // Remove after animation
        setTimeout(() => {
          activeNotifications.value = activeNotifications.value.filter(
            (n) => n.id !== notification.id
          );
        }, 1300);
      }
    }
  },
  { deep: true }
);

const getMultiplierColor = (multiplier: number) => {
  if (multiplier >= 100) return "text-purple-400";
  if (multiplier >= 25) return "text-yellow-400";
  if (multiplier >= 10) return "text-blue-400";
  return "text-green-400";
};

const getMultiplierBg = (multiplier: number) => {
  if (multiplier >= 100) return "bg-purple-900/90 border-purple-500";
  if (multiplier >= 25) return "bg-yellow-900/90 border-yellow-500";
  if (multiplier >= 10) return "bg-blue-900/90 border-blue-500";
  return "bg-green-900/90 border-green-500";
};
</script>

<template>
  <!-- Lucky Mine Tooltips (multiple) -->
  <TransitionGroup name="lucky-float">
    <div
      v-for="notification in activeNotifications"
      :key="notification.id"
      class="fixed z-[9999] pointer-events-none"
      :style="{
        left: notification.x + 'px',
        top: notification.y + 'px',
      }">
      <div
        :class="[
          'px-3 py-1.5 rounded-lg border text-sm font-bold whitespace-nowrap',
          getMultiplierBg(notification.multiplier),
          getMultiplierColor(notification.multiplier),
        ]"
        style="transform: translate(-50%, -100%); margin-top: -8px">
        <span class="mr-1">
          {{
            notification.multiplier >= 100
              ? "💎"
              : notification.multiplier >= 25
              ? "🌟"
              : notification.multiplier >= 10
              ? "✨"
              : "🍀"
          }}
        </span>
        <span>{{ Math.round(notification.multiplier * 10) / 10 }}x</span>
        <span class="text-white/80 ml-1.5"
          >+{{ formatBTC(notification.amount) }}</span
        >
      </div>
    </div>
  </TransitionGroup>
</template>

<style scoped>
/* Lucky float up animation */
.lucky-float-enter-active {
  animation: lucky-float-up 1.3s ease-out forwards;
}

.lucky-float-leave-active {
  /* Instant removal - already faded */
  opacity: 0 !important;
  transition: none;
}

.lucky-float-leave-to {
  opacity: 0;
}

@keyframes lucky-float-up {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  10% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  80% {
    opacity: 1;
    transform: translateY(-40px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0.9);
  }
}
</style>
