<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useGameState } from "@/composables/useGameState";
import { useSaveStore } from "@/stores/saveStore";
import type { Upgrade } from "@/types/game";

// Components
import HeroSection from "@/components/HeroSection.vue";
import SecondaryStats from "@/components/SecondaryStats.vue";
import TabNavigation from "@/components/TabNavigation.vue";
import RigsTab from "@/components/RigsTab.vue";
import UpgradesTab from "@/components/UpgradesTab.vue";
import ResearchTab from "@/components/ResearchTab.vue";
import AchievementsTab from "@/components/AchievementsTab.vue";
import StatsTab from "@/components/StatsTab.vue";
import PrestigeTab from "@/components/PrestigeTab.vue";
import ActivityLog from "@/components/ActivityLog.vue";
import AchievementNotification from "@/components/AchievementNotification.vue";

const {
  activeTab,
  upgrades,
  initGame,
  getGameStateForSave,
  loadGameState,
  resetGameState,
  addEvent,
} = useGameState();
const saveStore = useSaveStore();

const gameReady = ref(false);
const showSaveModal = ref(false);
const saveFlash = ref(false);

// Debug mode - only on localhost
const isLocalhost = computed(() => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
});

const enableAllSpecials = () => {
  upgrades.value.forEach((u: Upgrade) => {
    if (u.category === "special") {
      u.purchased = true;
    }
  });
  addEvent("🔧 [DEBUG] All special upgrades enabled!");
};

const isResearchUnlocked = () => {
  return (
    upgrades.value.find((u: Upgrade) => u.id === "research-lab")?.purchased ??
    false
  );
};

const handleSave = () => {
  const state = getGameStateForSave();
  const success = saveStore.saveGame(state);
  if (success) {
    addEvent("💾 Game saved!");
    saveFlash.value = true;
    setTimeout(() => {
      saveFlash.value = false;
    }, 500);
  }
};

const handleLoad = () => {
  const savedState = saveStore.loadGame();
  if (savedState) {
    loadGameState(savedState);
    gameReady.value = true;
    showSaveModal.value = false;
  }
};

const handleNewGame = () => {
  resetGameState();
  gameReady.value = true;
  showSaveModal.value = false;
};

const handleDeleteSave = () => {
  if (
    confirm("Are you sure you want to delete your save? This cannot be undone!")
  ) {
    saveStore.deleteSave();
    addEvent("🗑️ Save data deleted");
  }
};

onMounted(() => {
  // Check for existing save
  saveStore.checkForSave();

  if (saveStore.hasSaveData) {
    showSaveModal.value = true;
  } else {
    // No save, start new game automatically
    gameReady.value = true;
  }

  // Initialize game loop
  initGame();

  // Start auto-save
  saveStore.startAutoSave(handleSave);
});
</script>

<template>
  <!-- Save/Load Modal -->
  <div
    v-if="showSaveModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div
      class="bg-gradient-to-b from-game-card to-game-cardDark border border-bitcoin/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <h2 class="text-2xl font-bold text-bitcoin text-center mb-2">
        ⛏️ Bitcoin Mining Tycoon
      </h2>
      <p class="text-gray-400 text-center text-sm mb-6">
        A save file was found
      </p>

      <div class="space-y-3">
        <!-- Continue Game -->
        <button
          @click="handleLoad"
          class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-bitcoin to-bitcoin-dark hover:from-bitcoin-light hover:to-bitcoin text-white border border-bitcoin/50 shadow-lg hover:shadow-bitcoin/30 flex items-center justify-between">
          <span class="flex items-center gap-2">
            <span class="text-xl">▶️</span>
            <span>Continue Game</span>
          </span>
          <span class="text-sm text-white/70">{{
            saveStore.timeSinceLastSave
          }}</span>
        </button>

        <!-- New Game -->
        <button
          @click="handleNewGame"
          class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600/50 shadow-lg flex items-center gap-2">
          <span class="text-xl">🆕</span>
          <span>New Game</span>
        </button>

        <!-- Delete Save (smaller) -->
        <button
          @click="handleDeleteSave"
          class="w-full py-2 px-4 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
          🗑️ Delete Save Data
        </button>
      </div>
    </div>
  </div>

  <!-- Main Game -->
  <div class="max-w-[900px] mx-auto p-4 sm:p-2 min-h-screen no-select">
    <header class="text-center py-4 sm:py-2.5 mb-2.5 sm:mb-1">
      <h1 class="text-3xl sm:text-xl font-bold text-gradient-bitcoin">
        ⛏️ Bitcoin Mining Tycoon
      </h1>
    </header>

    <main class="card-game p-6 sm:p-3 shadow-game">
      <HeroSection />
      <SecondaryStats />
      <TabNavigation />

      <div class="min-h-[300px] sm:min-h-[200px]">
        <RigsTab v-if="activeTab === 'rigs'" />
        <UpgradesTab v-if="activeTab === 'upgrades'" />
        <ResearchTab v-if="activeTab === 'research' && isResearchUnlocked()" />
        <AchievementsTab v-if="activeTab === 'achievements'" />
        <StatsTab v-if="activeTab === 'stats'" />
        <PrestigeTab v-if="activeTab === 'prestige'" />
      </div>

      <ActivityLog />
    </main>

    <AchievementNotification />
  </div>

  <!-- Debug controls (bottom left) - only on localhost -->
  <div v-if="isLocalhost" class="fixed bottom-4 left-4 z-40">
    <button
      @click="enableAllSpecials"
      class="px-3 py-2 rounded-lg text-xs font-semibold bg-purple-600/80 hover:bg-purple-500 text-white border border-purple-400/50 backdrop-blur-sm transition-all">
      🔧 Enable All Specials
    </button>
  </div>

  <!-- Save controls (bottom right) -->
  <div class="fixed bottom-4 right-4 z-40 flex items-center gap-2">
    <!-- Auto-save indicator -->
    <div
      class="px-3 py-2 rounded-lg text-xs backdrop-blur-sm flex items-center gap-2"
      :class="
        saveStore.autoSaveEnabled
          ? 'bg-green-900/40 border border-green-500/40'
          : 'bg-red-900/40 border border-red-500/40'
      ">
      <button
        @click="saveStore.toggleAutoSave"
        class="flex items-center gap-1.5 transition-colors font-medium"
        :class="saveStore.autoSaveEnabled ? 'text-green-400' : 'text-red-400'">
        <span>{{ saveStore.autoSaveEnabled ? "🔄" : "⏸️" }}</span>
        <span>Auto-save {{ saveStore.autoSaveEnabled ? "ON" : "OFF" }}</span>
      </button>
      <span v-if="saveStore.autoSaveEnabled" class="text-gray-500">|</span>
      <span
        class="text-gray-400"
        v-if="saveStore.lastSaveTime && saveStore.autoSaveEnabled">
        {{ saveStore.timeSinceLastSave }}
      </span>
    </div>

    <!-- Manual save button -->
    <button
      @click="handleSave"
      class="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-bitcoin to-bitcoin-dark hover:from-bitcoin-light hover:to-bitcoin text-white text-sm border border-bitcoin/50 shadow-md hover:shadow-bitcoin/30 flex items-center gap-2"
      :class="{ 'ring-2 ring-green-400 ring-opacity-75': saveFlash }">
      <span>💾</span>
      <span>Save</span>
    </button>
  </div>
</template>

<style>
/* Legacy styles for donation footer */
.donation-footer {
  @apply mt-5 p-4 text-center;
}

.donation-content {
  @apply inline-flex items-center gap-3 py-3 px-5 rounded-xl;
  background: rgba(247, 147, 26, 0.1);
  border: 1px solid rgba(247, 147, 26, 0.2);
}

.donation-icon {
  @apply text-2xl text-bitcoin;
}

.donation-text {
  @apply flex flex-col items-start gap-1;
}

.donation-label {
  @apply text-sm text-gray-400;
}

.donation-address {
  @apply font-mono text-sm text-bitcoin break-all cursor-pointer transition-colors;
  -webkit-user-select: text;
  user-select: text;
}

.donation-address:hover {
  @apply text-bitcoin-light;
}
</style>
