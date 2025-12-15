<script setup lang="ts">
import { onMounted } from "vue";
import { useGameState } from "@/composables/useGameState";
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

const { activeTab, upgrades, initGame } = useGameState();

const isResearchUnlocked = () => {
  return (
    upgrades.value.find((u: Upgrade) => u.id === "research-lab")?.purchased ??
    false
  );
};

onMounted(() => {
  initGame();
});
</script>

<template>
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
