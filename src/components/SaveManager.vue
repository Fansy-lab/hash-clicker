<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useSaveStore } from "@/stores/saveStore";
import { useGameState } from "@/composables/useGameState";

const saveStore = useSaveStore();
const {
  getGameStateForSave,
  loadGameState,
  resetGameState,
  initGame,
  addEvent,
} = useGameState();

const showModal = ref(false);
const gameStarted = ref(false);
const saveFlash = ref(false);

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
    gameStarted.value = true;
    showModal.value = false;
  }
};

const handleNewGame = () => {
  resetGameState();
  gameStarted.value = true;
  showModal.value = false;
};

const handleDeleteSave = () => {
  if (
    confirm("Are you sure you want to delete your save? This cannot be undone!")
  ) {
    saveStore.deleteSave();
    addEvent("🗑️ Save data deleted");
  }
};

// Start auto-save when game starts
const startGame = () => {
  initGame();
  saveStore.startAutoSave(handleSave);
};

onMounted(() => {
  saveStore.checkForSave();
  if (saveStore.hasSaveData) {
    showModal.value = true;
  } else {
    // No save, start new game automatically
    gameStarted.value = true;
    startGame();
  }
});

onUnmounted(() => {
  saveStore.stopAutoSave();
});

// Expose for parent to know when game is ready
defineExpose({ gameStarted, startGame });
</script>

<template>
  <!-- Save/Load Modal -->
  <div
    v-if="showModal"
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

  <!-- In-game save controls (shown when modal is closed and game started) -->
  <div
    v-if="!showModal && gameStarted"
    class="fixed bottom-4 right-4 z-40 flex items-center gap-2">
    <!-- Auto-save indicator -->
    <div
      class="px-3 py-2 rounded-lg text-xs bg-black/60 backdrop-blur-sm border border-gray-700/50 flex items-center gap-2">
      <button
        @click="saveStore.toggleAutoSave"
        class="flex items-center gap-1.5 transition-colors"
        :class="saveStore.autoSaveEnabled ? 'text-green-400' : 'text-gray-500'">
        <span>{{ saveStore.autoSaveEnabled ? "🔄" : "⏸️" }}</span>
        <span>Auto-save</span>
      </button>
      <span class="text-gray-600">|</span>
      <span class="text-gray-400" v-if="saveStore.lastSaveTime">
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
