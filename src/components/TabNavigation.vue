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
  <div
    class="flex gap-1.5 mb-5 sm:mb-4 flex-wrap sm:flex-nowrap sm:overflow-x-auto sm:overflow-y-hidden sm:pb-1 scrollbar-hide">
    <template v-for="tab in tabs" :key="tab.id">
      <button
        v-if="tab.id !== 'research' || isResearchUnlocked()"
        class="flex-1 sm:flex-none min-w-[80px] sm:min-w-0 py-3 px-4 sm:py-2.5 sm:px-3 rounded-lg text-sm sm:text-xs whitespace-nowrap transition-all duration-200 border-none cursor-pointer no-select"
        :class="
          activeTab === tab.id
            ? 'bg-gradient-to-br from-bitcoin to-bitcoin-dark text-white'
            : 'bg-game-hover text-gray-400 hover:bg-game-hoverLight hover:text-white'
        "
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
