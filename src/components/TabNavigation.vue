<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { activeTab, upgrades } = useGameState();

const tabs = [
  { id: "rigs", label: "⚡ Rigs" },
  { id: "upgrades", label: "🔧 Upgrades" },
  { id: "research", label: "🔬 Research" },
  { id: "achievements", label: "🏆 Achievements" },
  { id: "stats", label: "📊 Stats" },
  { id: "prestige", label: "⭐ Prestige" },
];

const isResearchUnlocked = () => {
  return (
    upgrades.value.find((u) => u.id === "research-lab")?.purchased ?? false
  );
};
</script>

<template>
  <div class="tabs">
    <template v-for="tab in tabs" :key="tab.id">
      <button
        v-if="tab.id !== 'research' || isResearchUnlocked()"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tabs button {
  flex: 1;
  min-width: 80px;
  padding: 12px 15px;
  background: #2d2d44;
  border: none;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
  /* Mobile optimizations */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

.tabs button:hover {
  background: #3d3d55;
  color: #fff;
}

.tabs button.active {
  background: linear-gradient(135deg, #f7931a 0%, #c77b15 100%);
  color: #fff;
}

@media (max-width: 480px) {
  .tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tabs button {
    flex: 0 0 auto;
    min-width: auto;
    padding: 10px 12px;
    font-size: 0.8em;
    white-space: nowrap;
  }
}
</style>
