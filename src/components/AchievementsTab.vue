<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { achievements } = useGameState();
</script>

<template>
  <div class="tab-content">
    <div class="achievements-grid">
      <div
        v-for="ach in achievements"
        :key="ach.id"
        class="achievement"
        :class="{ unlocked: ach.unlocked }">
        <div class="achievement-icon">{{ ach.unlocked ? "🏆" : "🔒" }}</div>
        <div class="achievement-info">
          <div class="achievement-name">{{ ach.name }}</div>
          <div class="achievement-desc">{{ ach.description }}</div>
          <div class="achievement-reward">Reward: {{ ach.reward }} BTC</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  max-height: 400px;
  overflow-y: auto;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.achievement {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 12px 10px;
  background: #1e1e32;
  border-radius: 8px;
  border: 1px solid #333;
  opacity: 0.5;
  transition: all 0.2s;
}

.achievement.unlocked {
  opacity: 1;
  border-color: #ffd700;
  background: linear-gradient(135deg, #1e1e32 0%, #2a2a35 100%);
}

.achievement-icon {
  font-size: 1.5em;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 3px;
}

.achievement-desc {
  color: #aaa;
  font-size: 0.75em;
  margin-bottom: 4px;
}

.achievement-reward {
  color: #f7931a;
  font-size: 0.75em;
}
</style>
