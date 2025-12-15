<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatNumber } from "@/utils/formatters";

const {
  bitcoin,
  availableRigs,
  lockedRigsCount,
  nextLockedRig,
  totalMinedEver,
  getRigCost,
  buyRig,
  poolMining,
  togglePool,
  upgrades,
} = useGameState();

const hasPoolAccess = () => {
  return upgrades.value.find((u) => u.id === "pool-access")?.purchased ?? false;
};
</script>

<template>
  <div class="tab-content">
    <div v-if="hasPoolAccess()" class="pool-toggle">
      <button :class="{ active: poolMining }" @click="togglePool">
        {{ poolMining ? "🏊 Pool Mining ON" : "⛏️ Solo Mining" }}
      </button>
      <span class="pool-info">Pool: +20% power, -2% fee</span>
    </div>

    <div class="items-grid">
      <div
        v-for="rig in availableRigs"
        :key="rig.id"
        class="item rig"
        :class="{ affordable: bitcoin >= getRigCost(rig) }">
        <div class="item-header">
          <span class="item-name">{{ rig.name }}</span>
          <span class="item-count">x{{ rig.count }}</span>
        </div>
        <div class="item-stats">
          <span>⚡ {{ formatNumber(rig.hashPower) }} H/s</span>
          <span>💡 {{ formatBTC(rig.electricityCost) }}/s</span>
        </div>
        <button
          class="buy-btn"
          :disabled="bitcoin < getRigCost(rig)"
          @click="buyRig(rig)">
          Buy: {{ formatBTC(getRigCost(rig)) }} BTC
        </button>
      </div>

      <!-- Next locked rig -->
      <div v-if="nextLockedRig" class="item rig upcoming">
        <div class="item-header">
          <span class="item-name">🔒 {{ nextLockedRig.name }}</span>
        </div>
        <div class="item-stats">
          <span>⚡ {{ formatNumber(nextLockedRig.hashPower) }} H/s</span>
          <span>💡 {{ formatBTC(nextLockedRig.electricityCost) }}/s</span>
        </div>
        <div class="unlock-requirement">
          {{ formatNumber(totalMinedEver) }} /
          {{ formatNumber(nextLockedRig.unlockAt) }} BTC
        </div>
      </div>

      <!-- More rigs indicator -->
      <div v-if="lockedRigsCount > 1" class="more-coming">
        <span class="more-text">+{{ lockedRigsCount - 1 }} more</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  max-height: 400px;
  overflow-y: auto;
}

.pool-toggle {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  background: #1e1e32;
  border-radius: 8px;
}

.pool-toggle button {
  padding: 10px 20px;
  background: #2d2d44;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.pool-toggle button.active {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.pool-info {
  color: #888;
  font-size: 0.9em;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.item {
  background: #1e1e32;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #333;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item.affordable {
  border-color: #f7931a55;
  background: linear-gradient(135deg, #1e1e32 0%, #2a2a40 100%);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-weight: bold;
  font-size: 0.95em;
}

.item-count {
  background: #f7931a;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8em;
}

.item-stats {
  display: flex;
  gap: 10px;
  font-size: 0.8em;
  color: #aaa;
}

.buy-btn {
  width: 100%;
  padding: 8px;
  background: linear-gradient(135deg, #2d2d44 0%, #3d3d55 100%);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
}

.buy-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f7931a 0%, #c77b15 100%);
}

.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Upcoming/Locked rigs */
.item.upcoming {
  opacity: 0.5;
  border-color: #444;
  background: linear-gradient(135deg, #1a1a28 0%, #222235 100%);
}

.item.upcoming .item-name {
  color: #888;
  font-size: 0.9em;
}

.unlock-requirement {
  font-size: 0.75em;
  color: #888;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  text-align: center;
}

.more-coming {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px dashed #444;
}

.more-text {
  font-size: 0.8em;
  color: #666;
}
</style>
