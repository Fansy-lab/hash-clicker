<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC } from "@/utils/formatters";

const { bitcoin, availableResearch, activeResearch, startResearch } =
  useGameState();
</script>

<template>
  <div class="tab-content">
    <div class="items-grid">
      <div
        v-for="res in availableResearch"
        :key="res.id"
        class="item research"
        :class="{
          completed: res.completed,
          active: activeResearch === res.id,
          affordable:
            !res.completed && activeResearch !== res.id && bitcoin >= res.cost,
        }">
        <div class="item-header">
          <span class="item-name">{{ res.name }}</span>
          <span v-if="res.completed" class="completed-badge">✓</span>
          <span v-else-if="activeResearch === res.id" class="active-badge"
            >🔬</span
          >
        </div>
        <div class="item-desc">{{ res.effect }}</div>

        <div
          v-if="activeResearch === res.id && !res.completed"
          class="research-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: (res.progress / res.researchTime) * 100 + '%',
              }"></div>
          </div>
          <div class="progress-text">
            {{ ((res.progress / res.researchTime) * 100).toFixed(1) }}%
          </div>
        </div>

        <button
          v-if="!res.completed && activeResearch !== res.id"
          class="buy-btn"
          :disabled="bitcoin < res.cost || activeResearch !== null"
          @click="startResearch(res)">
          Research: {{ formatBTC(res.cost) }} BTC
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  max-height: 400px;
  overflow-y: auto;
}

.items-grid {
  display: grid;
  gap: 10px;
}

.item {
  background: #1e1e32;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #333;
  transition: all 0.2s;
}

.item.affordable {
  border-color: #3498db55;
  background: linear-gradient(135deg, #1e1e32 0%, #1e2832 100%);
}

.item.completed {
  opacity: 0.6;
  border-color: #2ed573;
}

.item.active {
  border-color: #3498db;
  background: linear-gradient(135deg, #1e1e32 0%, #1e2840 100%);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-name {
  font-weight: bold;
  font-size: 1.05em;
}

.completed-badge {
  background: #2ed573;
  color: #000;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.85em;
  font-weight: bold;
}

.active-badge {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.item-desc {
  color: #aaa;
  font-size: 0.9em;
  margin-bottom: 12px;
}

.research-progress {
  margin-bottom: 10px;
}

.progress-bar {
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  font-size: 0.85em;
  color: #3498db;
}

.buy-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #2d2d44 0%, #3d3d55 100%);
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.buy-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
