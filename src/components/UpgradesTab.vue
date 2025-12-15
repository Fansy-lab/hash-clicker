<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";
import { formatBTC, formatNumber } from "@/utils/formatters";

const {
  bitcoin,
  availableUpgrades,
  upcomingUpgrades,
  buyUpgrade,
  totalMinedEver,
} = useGameState();

const categoryLabels: Record<string, string> = {
  efficiency: "💡 Efficiency",
  power: "⚡ Power",
  special: "⛏️ Special",
  prestige: "⭐ Prestige",
};

// Get next upcoming upgrade per category (only 1)
const getNextUpgradeForCategory = (category: string) => {
  return (
    upcomingUpgrades.value
      .filter((u) => u.category === category)
      .slice(0, 1)[0] || null
  );
};

// Check if there are more upgrades coming for a category beyond the next one
const hasMoreForCategory = (category: string) => {
  return (
    upcomingUpgrades.value.filter((u) => u.category === category).length > 1
  );
};
</script>

<template>
  <div class="tab-content">
    <div
      v-for="category in ['efficiency', 'power', 'special', 'prestige']"
      :key="category"
      class="upgrade-category">
      <h3 class="category-title">{{ categoryLabels[category] }}</h3>
      <div class="items-grid">
        <!-- Available upgrades -->
        <div
          v-for="upgrade in availableUpgrades.filter(
            (u) => u.category === category
          )"
          :key="upgrade.id"
          class="item upgrade"
          :class="{
            purchased: upgrade.purchased,
            affordable: !upgrade.purchased && bitcoin >= upgrade.cost,
          }">
          <div class="item-header">
            <span class="item-name">{{ upgrade.name }}</span>
            <span v-if="upgrade.purchased" class="purchased-badge">✓</span>
          </div>
          <div class="item-desc">{{ upgrade.effect }}</div>
          <button
            v-if="!upgrade.purchased"
            class="buy-btn"
            :disabled="bitcoin < upgrade.cost"
            @click="buyUpgrade(upgrade)">
            Buy: {{ formatBTC(upgrade.cost) }} BTC
          </button>
        </div>

        <!-- Next upcoming upgrade (greyed out) -->
        <div
          v-if="getNextUpgradeForCategory(category)"
          class="item upgrade upcoming">
          <div class="item-header">
            <span class="item-name"
              >🔒 {{ getNextUpgradeForCategory(category)!.name }}</span
            >
          </div>
          <div class="item-desc">
            {{ getNextUpgradeForCategory(category)!.effect }}
          </div>
          <div class="unlock-requirement">
            {{ formatNumber(totalMinedEver) }} /
            {{ formatNumber(getNextUpgradeForCategory(category)!.unlockAt) }}
            BTC
          </div>
        </div>

        <!-- More upgrades indicator -->
        <div v-if="hasMoreForCategory(category)" class="more-coming">
          <span class="more-text"
            >+{{
              upcomingUpgrades.filter((u) => u.category === category).length - 1
            }}
            more</span
          >
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

.upgrade-category {
  margin-bottom: 20px;
}

.category-title {
  font-size: 1.1em;
  margin-bottom: 10px;
  color: #f7931a;
  padding-bottom: 5px;
  border-bottom: 1px solid #333;
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

.item.purchased {
  opacity: 0.6;
  border-color: #2ed573;
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

.purchased-badge {
  background: #2ed573;
  color: #000;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.85em;
  font-weight: bold;
}

.item-desc {
  color: #aaa;
  font-size: 0.8em;
  flex: 1;
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

/* Upcoming/Locked upgrades */
.item.upcoming {
  opacity: 0.5;
  border-color: #444;
  background: linear-gradient(135deg, #1a1a28 0%, #222235 100%);
}

.item.upcoming .item-name {
  color: #888;
  font-size: 0.9em;
}

.item.upcoming .item-desc {
  color: #666;
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
