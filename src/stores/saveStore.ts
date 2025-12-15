import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface SaveData {
  version: number;
  timestamp: number;
  gameState: {
    bitcoin: number;
    totalMinedEver: number;
    globalBitcoinMined: number;
    hashRate: number;
    electricityDrain: number;
    gameTime: number;
    prestigeLevel: number;
    prestigePoints: number;
    btcPrice: number;
    usdBalance: number;
    difficulty: number;
    blocksMined: number;
    currentBlockReward: number;
    halvingCount: number;
    stats: {
      totalClicks: number;
      totalBTCEarned: number;
      totalBTCSpent: number;
      rigsBought: number;
      upgradesBought: number;
      achievementsUnlocked: number;
      prestigeResets: number;
      peakBTC: number;
      playTime: number;
    };
    poolMining: boolean;
    rigs: Array<{
      id: string;
      count: number;
    }>;
    upgrades: Array<{
      id: string;
      purchased: boolean;
    }>;
    research: Array<{
      id: string;
      progress: number;
      completed: boolean;
    }>;
    achievements: Array<{
      id: string;
      unlocked: boolean;
    }>;
  };
}

const SAVE_KEY = "btc_miner_save";
const SAVE_VERSION = 1;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useSaveStore = defineStore("save", () => {
  const lastSaveTime = ref<number | null>(null);
  const isLoading = ref(false);
  const hasSaveData = ref(false);
  const autoSaveEnabled = ref(true);
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  // Check if save exists on init
  const checkForSave = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    hasSaveData.value = saved !== null;
    if (saved) {
      try {
        const data = JSON.parse(saved) as SaveData;
        lastSaveTime.value = data.timestamp;
      } catch {
        hasSaveData.value = false;
      }
    }
  };

  const timeSinceLastSave = computed(() => {
    if (!lastSaveTime.value) return null;
    const diff = Date.now() - lastSaveTime.value;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  });

  const saveGame = (gameState: SaveData["gameState"]) => {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      gameState,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      lastSaveTime.value = saveData.timestamp;
      hasSaveData.value = true;
      return true;
    } catch (error) {
      console.error("Failed to save game:", error);
      return false;
    }
  };

  const loadGame = (): SaveData["gameState"] | null => {
    isLoading.value = true;
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return null;

      const data = JSON.parse(saved) as SaveData;

      // Version check for future migrations
      if (data.version !== SAVE_VERSION) {
        console.warn("Save version mismatch, may need migration");
        // Future: add migration logic here
      }

      lastSaveTime.value = data.timestamp;
      return data.gameState;
    } catch (error) {
      console.error("Failed to load game:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSave = () => {
    localStorage.removeItem(SAVE_KEY);
    lastSaveTime.value = null;
    hasSaveData.value = false;
  };

  const startAutoSave = (saveCallback: () => void) => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }
    autoSaveTimer = setInterval(() => {
      if (autoSaveEnabled.value) {
        saveCallback();
        console.log("🔄 Auto-saved game");
      }
    }, AUTO_SAVE_INTERVAL);
  };

  const stopAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  };

  const toggleAutoSave = () => {
    autoSaveEnabled.value = !autoSaveEnabled.value;
  };

  // Initialize
  checkForSave();

  return {
    lastSaveTime,
    timeSinceLastSave,
    isLoading,
    hasSaveData,
    autoSaveEnabled,
    saveGame,
    loadGame,
    deleteSave,
    startAutoSave,
    stopAutoSave,
    toggleAutoSave,
    checkForSave,
  };
});
