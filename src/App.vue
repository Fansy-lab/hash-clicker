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
  <div class="game-container">
    <header class="game-header">
      <h1>⛏️ Bitcoin Mining Tycoon</h1>
    </header>

    <main class="game-main">
      <HeroSection />
      <SecondaryStats />
      <TabNavigation />

      <div class="tab-panel">
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Mobile optimizations */
html,
body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection during gameplay */
.game-container {
  -webkit-user-select: none;
  user-select: none;
}

/* Allow text selection in specific areas if needed */
.balance-value,
.donation-address {
  -webkit-user-select: text;
  user-select: text;
}

/* Ensure all buttons are touch-optimized */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #0f0f1a 100%);
  min-height: 100vh;
  color: #fff;
}

.game-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 15px;
  min-height: 100vh;
}

.game-header {
  text-align: center;
  padding: 15px 0;
  margin-bottom: 10px;
}

.game-header h1 {
  font-size: 1.8em;
  background: linear-gradient(135deg, #f7931a 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-main {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid #333;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.tab-panel {
  min-height: 300px;
}

/* Mobile responsive styles */
@media (max-width: 480px) {
  .game-container {
    padding: 8px;
  }

  .game-header {
    padding: 10px 0;
    margin-bottom: 5px;
  }

  .game-header h1 {
    font-size: 1.4em;
  }

  .game-main {
    padding: 12px;
    border-radius: 12px;
  }

  .tab-panel {
    min-height: 200px;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #f7931a55;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f7931a;
}

.donation-footer {
  margin-top: 20px;
  padding: 15px;
  text-align: center;
}

.donation-content {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(247, 147, 26, 0.1);
  border: 1px solid rgba(247, 147, 26, 0.2);
  border-radius: 12px;
}

.donation-icon {
  font-size: 1.5em;
  color: #f7931a;
}

.donation-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.donation-label {
  font-size: 0.85em;
  color: #888;
}

.donation-address {
  font-family: monospace;
  font-size: 0.9em;
  color: #f7931a;
  word-break: break-all;
  cursor: pointer;
  transition: color 0.2s;
}

.donation-address:hover {
  color: #ffd700;
}
</style>
