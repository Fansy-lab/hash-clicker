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
  <div class="max-h-[400px] overflow-y-auto">
    <div
      v-for="category in ['efficiency', 'power', 'special', 'prestige']"
      :key="category"
      class="mb-5">
      <h3
        class="text-lg mb-2.5 text-bitcoin pb-1.5 border-b border-game-border">
        {{ categoryLabels[category] }}
      </h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
        <!-- Available upgrades -->
        <div
          v-for="upgrade in availableUpgrades.filter(
            (u) => u.category === category
          )"
          :key="upgrade.id"
          class="rounded-lg p-2.5 border border-game-border transition-all duration-200 flex flex-col gap-1.5"
          :class="{
            'opacity-60 border-profit': upgrade.purchased,
            'border-bitcoin/30 bg-gradient-to-br from-[#1e1e32] to-[#2a2a40]':
              !upgrade.purchased && bitcoin >= upgrade.cost,
            'bg-[#1e1e32]': !upgrade.purchased && bitcoin < upgrade.cost,
          }">
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm">{{ upgrade.name }}</span>
            <span
              v-if="upgrade.purchased"
              class="bg-profit text-black py-0.5 px-2 rounded-full text-xs font-bold"
              >✓</span
            >
          </div>
          <div class="text-gray-400 text-xs flex-1">{{ upgrade.effect }}</div>
          <button
            v-if="!upgrade.purchased"
            class="w-full py-2 rounded-md text-white text-xs cursor-pointer transition-all duration-200 border-none bg-gradient-to-br from-game-hover to-game-hoverLight hover:from-bitcoin hover:to-bitcoin-dark disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="bitcoin < upgrade.cost"
            @click="buyUpgrade(upgrade)">
            Buy: {{ formatBTC(upgrade.cost) }} BTC
          </button>
        </div>

        <!-- Next upcoming upgrade (greyed out) -->
        <div
          v-if="getNextUpgradeForCategory(category)"
          class="rounded-lg p-2.5 border border-[#444] transition-all duration-200 flex flex-col gap-1.5 opacity-50 bg-gradient-to-br from-[#1a1a28] to-[#222235]">
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm text-gray-400"
              >🔒 {{ getNextUpgradeForCategory(category)!.name }}</span
            >
          </div>
          <div class="text-gray-500 text-xs flex-1">
            {{ getNextUpgradeForCategory(category)!.effect }}
          </div>
          <div
            class="text-xs text-gray-400 py-1.5 px-2 bg-black/20 rounded text-center">
            {{ formatNumber(totalMinedEver) }} /
            {{
              formatNumber(getNextUpgradeForCategory(category)!.unlockAt)
            }}
            BTC
          </div>
        </div>

        <!-- More upgrades indicator -->
        <div
          v-if="hasMoreForCategory(category)"
          class="flex items-center justify-center p-2.5 bg-white/[0.02] rounded-lg border border-dashed border-[#444]">
          <span class="text-xs text-gray-500"
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
