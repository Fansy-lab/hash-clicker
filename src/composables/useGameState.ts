import { ref, computed } from "vue";
import type {
  Rig,
  Upgrade,
  Achievement,
  Research,
  RandomEvent,
  GameStats,
  EventMultiplierBackup,
  AchievementNotification,
} from "@/types/game";
import {
  MAX_BITCOIN,
  BASE_DIFFICULTY,
  HALVING_INTERVAL,
  INITIAL_BLOCK_REWARD,
} from "@/types/game";
import { INITIAL_RIGS } from "@/data/rigs";
import { INITIAL_UPGRADES } from "@/data/upgrades";
import { INITIAL_RESEARCH } from "@/data/research";
import { formatBTC } from "@/utils/formatters";

// Create a singleton instance
let gameStateInstance: ReturnType<typeof createGameState> | null = null;

function createGameState() {
  // ==================== GAME STATE ====================
  const bitcoin = ref(0);
  const totalMinedEver = ref(0);
  const globalBitcoinMined = ref(0);
  const hashRate = ref(0);
  const electricityDrain = ref(0);
  const events = ref<string[]>([]);
  const gameTime = ref(0);
  const clickPower = ref(1);
  const prestigeLevel = ref(0);
  const prestigePoints = ref(0);
  const activeTab = ref("rigs");

  // Market & Economy
  const btcPrice = ref(100);
  const marketTrend = ref(0);
  const usdBalance = ref(50); // Start with $50 to buy first USB miner
  const principalDebt = ref(0); // Track debt without interest (for debugging)

  // Difficulty & Halving
  const difficulty = ref(BASE_DIFFICULTY);
  const blocksMined = ref(0);
  const currentBlockReward = ref(INITIAL_BLOCK_REWARD);
  const halvingCount = ref(0);

  // Active Events
  const activeEvent = ref<RandomEvent | null>(null);
  const eventTimer = ref(0);

  // Multipliers from various sources
  const globalMultiplier = ref(1);
  const clickMultiplier = ref(1);
  const passiveMultiplier = ref(1);
  const electricityReduction = ref(1);

  // Store original values before events modify them
  const eventMultiplierBackup = ref<EventMultiplierBackup>({
    global: 1,
    click: 1,
    passive: 1,
    electricity: 1,
    difficulty: 1,
    btcPrice: 100,
  });

  // Statistics
  const stats = ref<GameStats>({
    totalClicks: 0,
    totalBTCEarned: 0,
    totalBTCSpent: 0,
    rigsBought: 0,
    upgradesBought: 0,
    achievementsUnlocked: 0,
    prestigeResets: 0,
    peakBTC: 0,
    playTime: 0,
  });

  // Pool Mining
  const poolMining = ref(false);
  const poolBonus = ref(1.2);
  const poolFee = ref(0.02);

  // Data
  const rigs = ref<Rig[]>(JSON.parse(JSON.stringify(INITIAL_RIGS)));
  const upgrades = ref<Upgrade[]>(JSON.parse(JSON.stringify(INITIAL_UPGRADES)));
  const research = ref<Research[]>(
    JSON.parse(JSON.stringify(INITIAL_RESEARCH))
  );
  const activeResearch = ref<string | null>(null);

  // Achievement notification
  const achievementNotification = ref<AchievementNotification | null>(null);
  let notificationTimeout: number | null = null;

  // ==================== ACHIEVEMENTS ====================
  const achievements = ref<Achievement[]>([
    {
      id: "first-btc",
      name: "First Satoshi",
      description: "Mine 0.1 Bitcoin",
      unlocked: false,
      reward: 1,
      check: () => totalMinedEver.value >= 0.1,
    },
    {
      id: "one-btc",
      name: "Whole Coiner",
      description: "Own 1 whole Bitcoin",
      unlocked: false,
      reward: 5,
      check: () => bitcoin.value >= 1,
    },
    {
      id: "ten-btc",
      name: "Stacker",
      description: "Own 10 Bitcoin",
      unlocked: false,
      reward: 25,
      check: () => bitcoin.value >= 10,
    },
    {
      id: "hundred-btc",
      name: "HODLer",
      description: "Own 100 Bitcoin",
      unlocked: false,
      reward: 100,
      check: () => bitcoin.value >= 100,
    },
    {
      id: "thousand-btc",
      name: "Whale",
      description: "Own 1,000 Bitcoin",
      unlocked: false,
      reward: 500,
      check: () => bitcoin.value >= 1000,
    },
    {
      id: "ten-thousand-btc",
      name: "Mega Whale",
      description: "Own 10,000 Bitcoin",
      unlocked: false,
      reward: 2500,
      check: () => bitcoin.value >= 10000,
    },
    {
      id: "click-100",
      name: "Clicker",
      description: "Click 100 times",
      unlocked: false,
      reward: 2,
      check: () => stats.value.totalClicks >= 100,
    },
    {
      id: "click-1000",
      name: "Click Master",
      description: "Click 1,000 times",
      unlocked: false,
      reward: 20,
      check: () => stats.value.totalClicks >= 1000,
    },
    {
      id: "click-10000",
      name: "Carpal Tunnel",
      description: "Click 10,000 times",
      unlocked: false,
      reward: 100,
      check: () => stats.value.totalClicks >= 10000,
    },
    {
      id: "first-rig",
      name: "Baby Miner",
      description: "Buy your first rig",
      unlocked: false,
      reward: 1,
      check: () => stats.value.rigsBought >= 1,
    },
    {
      id: "ten-rigs",
      name: "Small Operation",
      description: "Own 10 total rigs",
      unlocked: false,
      reward: 10,
      check: () =>
        rigs.value.reduce((sum: number, r: Rig) => sum + r.count, 0) >= 10,
    },
    {
      id: "hundred-rigs",
      name: "Mining Mogul",
      description: "Own 100 total rigs",
      unlocked: false,
      reward: 100,
      check: () =>
        rigs.value.reduce((sum: number, r: Rig) => sum + r.count, 0) >= 100,
    },
    {
      id: "first-upgrade",
      name: "Upgraded",
      description: "Purchase your first upgrade",
      unlocked: false,
      reward: 2,
      check: () => stats.value.upgradesBought >= 1,
    },
    {
      id: "five-upgrades",
      name: "Optimizer",
      description: "Purchase 5 upgrades",
      unlocked: false,
      reward: 15,
      check: () => stats.value.upgradesBought >= 5,
    },
    {
      id: "ten-upgrades",
      name: "Max Efficiency",
      description: "Purchase 10 upgrades",
      unlocked: false,
      reward: 50,
      check: () => stats.value.upgradesBought >= 10,
    },
    {
      id: "first-halving",
      name: "Halving Survivor",
      description: "Survive your first halving",
      unlocked: false,
      reward: 50,
      check: () => halvingCount.value >= 1,
    },
    {
      id: "third-halving",
      name: "Halving Veteran",
      description: "Survive 3 halvings",
      unlocked: false,
      reward: 500,
      check: () => halvingCount.value >= 3,
    },
    {
      id: "prestige-1",
      name: "Rebirth",
      description: "Prestige for the first time",
      unlocked: false,
      reward: 100,
      check: () => stats.value.prestigeResets >= 1,
    },
    {
      id: "play-hour",
      name: "Dedicated",
      description: "Play for 1 hour",
      unlocked: false,
      reward: 10,
      check: () => stats.value.playTime >= 3600,
    },
    {
      id: "millionaire",
      name: "Millionaire",
      description: "Earn 1,000,000 BTC total",
      unlocked: false,
      reward: 10000,
      check: () => stats.value.totalBTCEarned >= 1000000,
    },
  ]);

  // ==================== RANDOM EVENTS ====================
  const possibleEvents: RandomEvent[] = [
    {
      id: "bull-run",
      name: "🚀 Bull Run!",
      description: "BTC price doubles temporarily!",
      duration: 300,
      effect: () => {
        eventMultiplierBackup.value.btcPrice = btcPrice.value;
        btcPrice.value *= 2;
      },
      endEffect: () => {
        btcPrice.value = eventMultiplierBackup.value.btcPrice;
      },
    },
    {
      id: "bear-market",
      name: "📉 Bear Market",
      description: "BTC price drops 50%",
      duration: 300,
      effect: () => {
        eventMultiplierBackup.value.btcPrice = btcPrice.value;
        btcPrice.value *= 0.5;
      },
      endEffect: () => {
        btcPrice.value = eventMultiplierBackup.value.btcPrice;
      },
    },
    {
      id: "power-surge",
      name: "⚡ Power Surge",
      description: "Free electricity for 30 seconds!",
      duration: 300,
      effect: () => {
        eventMultiplierBackup.value.electricity = electricityReduction.value;
        electricityReduction.value = 0;
      },
      endEffect: () => {
        electricityReduction.value = eventMultiplierBackup.value.electricity;
      },
    },
    {
      id: "hash-boost",
      name: "💨 Hash Boost",
      description: "Triple hash rate temporarily!",
      duration: 200,
      effect: () => {
        eventMultiplierBackup.value.global = globalMultiplier.value;
        globalMultiplier.value = 3;
      },
      endEffect: () => {
        globalMultiplier.value = eventMultiplierBackup.value.global;
      },
    },
    {
      id: "difficulty-spike",
      name: "📈 Difficulty Spike",
      description: "Mining difficulty doubled!",
      duration: 400,
      effect: () => {
        eventMultiplierBackup.value.difficulty = difficulty.value;
        difficulty.value *= 2;
      },
      endEffect: () => {
        difficulty.value = eventMultiplierBackup.value.difficulty;
      },
    },
    {
      id: "lucky-block",
      name: "🍀 Lucky Block",
      description: "Found a bonus block!",
      duration: 0,
      effect: () => {
        const bonus = currentBlockReward.value * 5;
        bitcoin.value += bonus;
        addEvent(`Lucky block! +${formatBTC(bonus)} BTC`);
      },
    },
    {
      id: "maintenance",
      name: "🔧 Emergency Maintenance",
      description: "Rigs offline for repairs - NO MINING!",
      duration: 150,
      effect: () => {
        eventMultiplierBackup.value.passive = passiveMultiplier.value;
        passiveMultiplier.value = 0;
      },
      endEffect: () => {
        passiveMultiplier.value = eventMultiplierBackup.value.passive;
      },
    },
    {
      id: "gov-crackdown",
      name: "🏛️ Government Crackdown",
      description: "Mining restricted - 50% production!",
      duration: 250,
      effect: () => {
        eventMultiplierBackup.value.global = globalMultiplier.value;
        globalMultiplier.value = 0.5;
      },
      endEffect: () => {
        globalMultiplier.value = eventMultiplierBackup.value.global;
      },
    },
    {
      id: "solar-flare",
      name: "☀️ Solar Flare",
      description: "Electronics disrupted! 75% less mining!",
      duration: 100,
      effect: () => {
        eventMultiplierBackup.value.passive = passiveMultiplier.value;
        eventMultiplierBackup.value.click = clickMultiplier.value;
        passiveMultiplier.value = 0.25;
        clickMultiplier.value = 0.5;
      },
      endEffect: () => {
        passiveMultiplier.value = eventMultiplierBackup.value.passive;
        clickMultiplier.value = eventMultiplierBackup.value.click;
      },
    },
    {
      id: "whale-dump",
      name: "🐋 Whale Dump",
      description: "Big player sold! Price crashing 70%!",
      duration: 200,
      effect: () => {
        eventMultiplierBackup.value.btcPrice = btcPrice.value;
        btcPrice.value *= 0.3;
      },
      endEffect: () => {
        btcPrice.value = eventMultiplierBackup.value.btcPrice;
      },
    },
    {
      id: "etf-approval",
      name: "📈 ETF Approved!",
      description: "Institutional money flooding in! +200% hash power!",
      duration: 350,
      effect: () => {
        eventMultiplierBackup.value.global = globalMultiplier.value;
        eventMultiplierBackup.value.btcPrice = btcPrice.value;
        globalMultiplier.value = 3;
        btcPrice.value *= 1.5;
      },
      endEffect: () => {
        globalMultiplier.value = eventMultiplierBackup.value.global;
      },
    },
    {
      id: "network-attack",
      name: "🔓 51% Attack Attempt!",
      description: "Network under attack! Mining halted for defense!",
      duration: 120,
      effect: () => {
        eventMultiplierBackup.value.passive = passiveMultiplier.value;
        eventMultiplierBackup.value.click = clickMultiplier.value;
        passiveMultiplier.value = 0;
        clickMultiplier.value = 0.1;
        const lost = bitcoin.value * 0.05;
        bitcoin.value -= lost;
        addEvent(`Lost ${formatBTC(lost)} BTC to attackers!`);
      },
      endEffect: () => {
        passiveMultiplier.value = eventMultiplierBackup.value.passive;
        clickMultiplier.value = eventMultiplierBackup.value.click;
        addEvent("Network secured! Mining resumed.");
      },
    },
  ];

  // ==================== COMPUTED VALUES ====================
  const getRigCost = (rig: Rig) => {
    return rig.baseCost * Math.pow(1.15, rig.count);
  };

  const effectiveDifficulty = computed(() => {
    let diff = difficulty.value;
    if (
      upgrades.value.find((u: Upgrade) => u.id === "difficulty-shield")
        ?.purchased
    ) {
      diff *= 0.75;
    }
    return diff;
  });

  const effectiveBlockReward = computed(() => {
    let reward = currentBlockReward.value;
    if (
      upgrades.value.find((u: Upgrade) => u.id === "halving-hedge")?.purchased
    ) {
      reward *= 1.5;
    }
    if (
      research.value.find((r: Research) => r.id === "anti-halving")?.completed
    ) {
      reward *= 1.25;
    }
    return reward;
  });

  const totalHashPower = computed(() => {
    let total = rigs.value.reduce((sum: number, rig: Rig) => {
      let power = rig.hashPower * rig.count;

      if (rig.id === "gpu" || rig.id === "multi-gpu") {
        if (
          upgrades.value.find((u: Upgrade) => u.id === "better-drivers")
            ?.purchased
        ) {
          power *= 1.25;
        }
      }
      if (rig.id === "asic" || rig.id === "asic-rack") {
        if (
          upgrades.value.find((u: Upgrade) => u.id === "firmware-1")?.purchased
        ) {
          power *= 1.2;
        }
        if (
          upgrades.value.find((u: Upgrade) => u.id === "firmware-2")?.purchased
        ) {
          power *= 1.35;
        }
      }
      return sum + power;
    }, 0);

    if (upgrades.value.find((u: Upgrade) => u.id === "overclock-1")?.purchased)
      total *= 1.3;
    if (upgrades.value.find((u: Upgrade) => u.id === "hash-boost-1")?.purchased)
      total *= 1.5;
    if (upgrades.value.find((u: Upgrade) => u.id === "hash-boost-2")?.purchased)
      total *= 1.75;
    if (upgrades.value.find((u: Upgrade) => u.id === "hash-boost-3")?.purchased)
      total *= 2;
    if (upgrades.value.find((u: Upgrade) => u.id === "ai-1")?.purchased)
      total *= 1.3;
    if (upgrades.value.find((u: Upgrade) => u.id === "ai-2")?.purchased)
      total *= 1.5;
    if (upgrades.value.find((u: Upgrade) => u.id === "ai-3")?.purchased)
      total *= 2;
    if (upgrades.value.find((u: Upgrade) => u.id === "parallel-1")?.purchased)
      total *= 1.4;
    if (upgrades.value.find((u: Upgrade) => u.id === "parallel-2")?.purchased)
      total *= 1.6;
    if (
      upgrades.value.find((u: Upgrade) => u.id === "genesis-block")?.purchased
    )
      total *= 11;

    if (
      research.value.find((r: Research) => r.id === "efficiency-1")?.completed
    )
      total *= 1.1;
    if (
      research.value.find((r: Research) => r.id === "efficiency-2")?.completed
    )
      total *= 1.2;

    const prestigeBoost1 = upgrades.value.find(
      (u: Upgrade) => u.id === "prestige-boost-1"
    )?.purchased;
    const prestigeBoost2 = upgrades.value.find(
      (u: Upgrade) => u.id === "prestige-boost-2"
    )?.purchased;
    if (prestigeBoost2) {
      total *= 1 + prestigeLevel.value * 0.25;
    } else if (prestigeBoost1) {
      total *= 1 + prestigeLevel.value * 0.1;
    } else {
      total *= 1 + prestigeLevel.value * 0.05;
    }

    if (poolMining.value) total *= poolBonus.value;

    total *= globalMultiplier.value;
    total *= passiveMultiplier.value;

    return total;
  });

  const totalElectricityCost = computed(() => {
    let total = rigs.value.reduce(
      (sum: number, rig: Rig) => sum + rig.electricityCost * rig.count,
      0
    );

    if (upgrades.value.find((u: Upgrade) => u.id === "cooling-1")?.purchased)
      total *= 0.85;
    if (upgrades.value.find((u: Upgrade) => u.id === "cooling-2")?.purchased)
      total *= 0.75;
    if (upgrades.value.find((u: Upgrade) => u.id === "cooling-3")?.purchased)
      total *= 0.6;
    if (upgrades.value.find((u: Upgrade) => u.id === "solar-1")?.purchased)
      total *= 0.8;
    if (upgrades.value.find((u: Upgrade) => u.id === "bulk-power")?.purchased)
      total *= 0.7;
    if (upgrades.value.find((u: Upgrade) => u.id === "green-energy")?.purchased)
      total *= 0.5;

    if (
      research.value.find((r: Research) => r.id === "power-research-1")
        ?.completed
    )
      total *= 0.85;

    total *= electricityReduction.value;

    return total;
  });

  const effectiveClickPower = computed(() => {
    let power = clickPower.value;

    if (upgrades.value.find((u: Upgrade) => u.id === "click-1")?.purchased)
      power *= 1.5;
    if (upgrades.value.find((u: Upgrade) => u.id === "click-2")?.purchased)
      power *= 2;
    if (upgrades.value.find((u: Upgrade) => u.id === "click-3")?.purchased)
      power *= 3;
    if (upgrades.value.find((u: Upgrade) => u.id === "click-4")?.purchased)
      power *= 6;

    power *= clickMultiplier.value;
    power *= globalMultiplier.value;
    power *= 1 + prestigeLevel.value * 0.05;

    return power;
  });

  const miningRate = computed(() => {
    const baseRate = totalHashPower.value / effectiveDifficulty.value;
    const rewardMultiplier = effectiveBlockReward.value / INITIAL_BLOCK_REWARD;
    return (baseRate * rewardMultiplier) / 10000;
  });

  // Net profit in BTC/s (mining rate only, electricity is paid in USD)
  const netProfit = computed(() => {
    return miningRate.value;
  });

  // Electricity cost in USD per second
  const electricityCostPerSecond = computed(() => {
    return totalElectricityCost.value;
  });

  // Net USD profit per second (BTC value mined minus electricity)
  const netProfitUSD = computed(() => {
    const btcValuePerSecond = miningRate.value * btcPrice.value;
    return btcValuePerSecond - totalElectricityCost.value;
  });

  const progressToHalving = computed(() => {
    return ((blocksMined.value % HALVING_INTERVAL) / HALVING_INTERVAL) * 100;
  });

  const progressToCap = computed(() => {
    return (globalBitcoinMined.value / MAX_BITCOIN) * 100;
  });

  const availableRigs = computed(() => {
    return rigs.value.filter(
      (r: Rig) => totalMinedEver.value >= r.unlockAt || r.count > 0
    );
  });

  const lockedRigsCount = computed(() => {
    return rigs.value.filter(
      (r: Rig) => totalMinedEver.value < r.unlockAt && r.count === 0
    ).length;
  });

  const nextLockedRig = computed(() => {
    return (
      rigs.value
        .filter((r: Rig) => totalMinedEver.value < r.unlockAt && r.count === 0)
        .sort((a: Rig, b: Rig) => a.unlockAt - b.unlockAt)[0] || null
    );
  });

  const availableUpgrades = computed(() => {
    return upgrades.value.filter((u: Upgrade) => {
      if (u.purchased) return true;
      if (totalMinedEver.value < u.unlockAt) return false;
      if (u.requirement) {
        const req = upgrades.value.find(
          (up: Upgrade) => up.id === u.requirement
        );
        if (!req?.purchased) return false;
      }
      return true;
    });
  });

  // Get upcoming upgrades (locked but coming soon)
  const upcomingUpgrades = computed(() => {
    const available = availableUpgrades.value;
    const availableIds = new Set(available.map((u: Upgrade) => u.id));

    return upgrades.value
      .filter((u: Upgrade) => {
        // Not already available
        if (availableIds.has(u.id)) return false;
        // Not purchased
        if (u.purchased) return false;
        // Check if requirement is met or will be met soon
        if (u.requirement) {
          const req = upgrades.value.find(
            (up: Upgrade) => up.id === u.requirement
          );
          if (!req?.purchased && !availableIds.has(req?.id || "")) return false;
        }
        return true;
      })
      .sort((a: Upgrade, b: Upgrade) => a.unlockAt - b.unlockAt);
  });

  // Check if there are more upgrades beyond the upcoming ones
  const hasMoreUpgrades = computed(() => {
    const availableIds = new Set(
      availableUpgrades.value.map((u: Upgrade) => u.id)
    );
    const upcomingIds = new Set(
      upcomingUpgrades.value.slice(0, 2).map((u: Upgrade) => u.id)
    );

    return upgrades.value.some(
      (u: Upgrade) =>
        !u.purchased && !availableIds.has(u.id) && !upcomingIds.has(u.id)
    );
  });

  const availableResearch = computed(() => {
    return research.value.filter(
      (r: Research) => totalMinedEver.value >= r.unlockAt
    );
  });

  const prestigePointsOnReset = computed(() => {
    return Math.floor(Math.sqrt(totalMinedEver.value / 1000));
  });

  // ==================== ACTIONS ====================
  const addEvent = (message: string) => {
    const time = new Date().toLocaleTimeString();
    events.value.unshift(`[${time}] ${message}`);
    if (events.value.length > 50) {
      events.value.pop();
    }
  };

  const showAchievementNotification = (name: string, reward: number) => {
    achievementNotification.value = { name, reward };
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    notificationTimeout = window.setTimeout(() => {
      achievementNotification.value = null;
    }, 4000);
  };

  const mineClick = () => {
    if (globalBitcoinMined.value >= MAX_BITCOIN) {
      addEvent("All 21 million BTC have been mined!");
      return;
    }

    let amount = effectiveClickPower.value / (effectiveDifficulty.value * 50);
    amount *= effectiveBlockReward.value / INITIAL_BLOCK_REWARD;

    if (
      upgrades.value.find((u: Upgrade) => u.id === "lucky-mining")?.purchased &&
      Math.random() < 0.05
    ) {
      amount *= 2;
      addEvent("🍀 Lucky click! Double reward!");
    }

    if (poolMining.value) {
      amount *= 1 - poolFee.value;
    }

    const maxCanMine = MAX_BITCOIN - globalBitcoinMined.value;
    amount = Math.min(amount, maxCanMine);

    bitcoin.value += amount;
    totalMinedEver.value += amount;
    globalBitcoinMined.value += amount;
    stats.value.totalClicks++;
    stats.value.totalBTCEarned += amount;

    if (stats.value.peakBTC < bitcoin.value) {
      stats.value.peakBTC = bitcoin.value;
    }
  };

  // Sell BTC for USD at current market price
  const sellBTC = (amount: number) => {
    if (amount <= 0 || bitcoin.value < amount) return;
    const usdAmount = amount * btcPrice.value;
    bitcoin.value -= amount;
    usdBalance.value += usdAmount;
    stats.value.totalBTCSpent += amount;
    addEvent(`Sold ${amount.toFixed(6)} BTC for $${usdAmount.toFixed(2)}`);
  };

  // Sell all BTC
  const sellAllBTC = () => {
    if (bitcoin.value <= 0) return;
    sellBTC(bitcoin.value);
  };

  const buyRig = (rig: Rig) => {
    const cost = getRigCost(rig);
    if (usdBalance.value >= cost) {
      usdBalance.value -= cost;
      rig.count++;
      stats.value.rigsBought++;
      hashRate.value = totalHashPower.value;
      electricityDrain.value = totalElectricityCost.value;
      addEvent(`Bought ${rig.name} for $${cost.toFixed(2)}`);
    }
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (!upgrade.purchased && bitcoin.value >= upgrade.cost) {
      bitcoin.value -= upgrade.cost;
      stats.value.totalBTCSpent += upgrade.cost;
      upgrade.purchased = true;
      stats.value.upgradesBought++;
      hashRate.value = totalHashPower.value;
      electricityDrain.value = totalElectricityCost.value;
      addEvent(`Unlocked: ${upgrade.name}`);

      if (upgrade.id === "pool-access") {
        addEvent("Mining pool now available!");
      }
      if (upgrade.id === "research-lab") {
        addEvent("Research system unlocked!");
      }
    }
  };

  const startResearch = (res: Research) => {
    if (activeResearch.value || res.completed) return;
    if (bitcoin.value >= res.cost) {
      bitcoin.value -= res.cost;
      stats.value.totalBTCSpent += res.cost;
      activeResearch.value = res.id;
      addEvent(`Started research: ${res.name}`);
    }
  };

  const togglePool = () => {
    if (
      upgrades.value.find((u: Upgrade) => u.id === "pool-access")?.purchased
    ) {
      poolMining.value = !poolMining.value;
      addEvent(poolMining.value ? "Joined mining pool" : "Left mining pool");
    }
  };

  const prestige = () => {
    if (prestigePointsOnReset.value < 1) {
      addEvent("Need more BTC earned to prestige!");
      return;
    }

    const points = prestigePointsOnReset.value;
    prestigeLevel.value++;
    prestigePoints.value += points;
    stats.value.prestigeResets++;

    bitcoin.value = 0;
    totalMinedEver.value = 0;

    rigs.value.forEach((r: Rig) => (r.count = 0));
    upgrades.value.forEach((u: Upgrade) => {
      if (u.category !== "prestige") {
        u.purchased = false;
      }
    });
    research.value.forEach((r: Research) => {
      r.progress = 0;
      r.completed = false;
    });
    activeResearch.value = null;

    addEvent(`PRESTIGE! Level ${prestigeLevel.value} (+${points} points)`);
  };

  const triggerRandomEvent = () => {
    if (activeEvent.value) return;
    if (Math.random() > 0.015) return;

    const event =
      possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    activeEvent.value = event;
    eventTimer.value = event.duration;

    addEvent(`EVENT: ${event.name} - ${event.description}`);
    event.effect();

    if (event.duration === 0) {
      activeEvent.value = null;
    }
  };

  const checkAchievements = () => {
    achievements.value.forEach((ach: Achievement) => {
      if (!ach.unlocked && ach.check()) {
        ach.unlocked = true;
        // Add reward BTC and treat it as mined (affects halving, difficulty, etc.)
        bitcoin.value += ach.reward;
        totalMinedEver.value += ach.reward;
        globalBitcoinMined.value += ach.reward;
        stats.value.totalBTCEarned += ach.reward;
        stats.value.achievementsUnlocked++;
        addEvent(`🏆 Achievement: ${ach.name} (+${ach.reward} BTC)`);
        showAchievementNotification(ach.name, ach.reward);
      }
    });
  };

  const updateDifficulty = () => {
    // Difficulty increases based on player's total mined (for early game feedback)
    // and global mined (for late game scaling)
    const playerProgress = totalMinedEver.value;
    const globalProgress = globalBitcoinMined.value / MAX_BITCOIN;

    // Early game: difficulty grows with every tiny bit mined
    // Each 0.01 BTC mined adds 0.000001 to difficulty
    let baseDiff = BASE_DIFFICULTY + playerProgress * 0.0001;

    // Cap early game difficulty scaling at 2x
    baseDiff = Math.min(baseDiff, BASE_DIFFICULTY * 2);

    // Late game: exponential scaling based on global mined
    if (globalProgress > 0.1) {
      baseDiff *= Math.pow(1 + globalProgress * 10, 2);
    }

    if (globalProgress > 0.5) {
      baseDiff *= Math.pow(2, (globalProgress - 0.5) * 20);
    }
    if (globalProgress > 0.9) {
      baseDiff *= Math.pow(10, (globalProgress - 0.9) * 100);
    }
    if (globalProgress > 0.99) {
      baseDiff *= 1000000;
    }

    difficulty.value = baseDiff;
  };

  const checkHalving = () => {
    const newHalvingCount = Math.floor(blocksMined.value / HALVING_INTERVAL);
    if (newHalvingCount > halvingCount.value) {
      halvingCount.value = newHalvingCount;
      currentBlockReward.value =
        INITIAL_BLOCK_REWARD / Math.pow(2, halvingCount.value);
      addEvent(
        `⚡ HALVING #${
          halvingCount.value
        }! Block reward now: ${currentBlockReward.value.toFixed(8)} BTC`
      );
    }
  };

  // Market state tracking for realistic cycles
  const marketPhaseRef = ref<
    | "accumulation"
    | "markup"
    | "euphoria"
    | "distribution"
    | "decline"
    | "capitulation"
  >("accumulation");
  let phaseTimer = 0;
  let allTimeHigh = 100;

  // Market prediction system (80% accurate)
  const marketPrediction = computed(() => {
    const phase = marketPhaseRef.value;
    const isAccurate = Math.random() < 0.8; // 80% chance of accurate prediction

    // Accurate predictions based on phase
    const accuratePredictions: Record<string, { hint: string; emoji: string }> =
      {
        accumulation: { hint: "Consolidation phase... patience", emoji: "😐" },
        markup: { hint: "Bullish momentum building", emoji: "📈" },
        euphoria: { hint: "⚠️ Extreme greed! Top may be near", emoji: "🔥" },
        distribution: { hint: "Smart money exiting positions", emoji: "⚠️" },
        decline: { hint: "Downtrend in progress", emoji: "📉" },
        capitulation: { hint: "Extreme fear! Possible bottom", emoji: "😱" },
      };

    // Misleading predictions (20% of time)
    const misleadingPredictions = [
      { hint: "Breakout imminent!", emoji: "🚀" },
      { hint: "Support holding strong", emoji: "💪" },
      { hint: "Volatility decreasing", emoji: "😴" },
      { hint: "Accumulation detected", emoji: "🐋" },
      { hint: "Trend reversal possible", emoji: "🔄" },
    ];

    if (isAccurate) {
      return (
        accuratePredictions[phase] || { hint: "Analyzing...", emoji: "🔍" }
      );
    } else {
      return misleadingPredictions[
        Math.floor(Math.random() * misleadingPredictions.length)
      ];
    }
  });

  const updateMarket = () => {
    // Store old price to calculate actual change
    const oldPrice = btcPrice.value;

    // Track ATH
    if (btcPrice.value > allTimeHigh) {
      allTimeHigh = btcPrice.value;
    }

    // Update phase timer
    phaseTimer++;

    // Base growth - very small but consistent (0.05% per tick average)
    const baseGrowth = 0.0005;
    const timeBonus = Math.log10(gameTime.value + 1) * 0.00005;

    let priceChange = baseGrowth + timeBonus;

    // Phase transitions and behavior
    switch (marketPhaseRef.value) {
      case "accumulation":
        // Slow sideways/slightly up movement, low volatility
        priceChange += (Math.random() - 0.48) * 0.02;
        // Transition to markup after accumulation period
        if (phaseTimer > 100 + Math.random() * 150) {
          if (Math.random() < 0.4) {
            marketPhaseRef.value = "markup";
            phaseTimer = 0;
            addEvent("📈 Market momentum building...");
          }
        }
        break;

      case "markup":
        // Steady upward trend, moderate volatility
        priceChange += 0.008 + (Math.random() - 0.3) * 0.04;
        // Can transition to euphoria (big pump) or back to accumulation
        if (phaseTimer > 50 + Math.random() * 100) {
          const roll = Math.random();
          if (roll < 0.35) {
            marketPhaseRef.value = "euphoria";
            phaseTimer = 0;
            addEvent("🚀 EUPHORIA! BTC IS MOONING!");
          } else if (roll < 0.5) {
            marketPhaseRef.value = "accumulation";
            phaseTimer = 0;
          }
        }
        break;

      case "euphoria":
        // HARD pump - this is the "number go up" phase
        priceChange += 0.03 + Math.random() * 0.08; // +3% to +11% per tick!
        // Euphoria is short-lived, always leads to distribution/crash
        if (phaseTimer > 15 + Math.random() * 25) {
          marketPhaseRef.value = "distribution";
          phaseTimer = 0;
          addEvent("⚠️ Whales are selling...");
        }
        break;

      case "distribution":
        // Top is in, smart money selling, volatile sideways/down
        priceChange += (Math.random() - 0.6) * 0.05;
        // Leads to decline or capitulation
        if (phaseTimer > 30 + Math.random() * 50) {
          const roll = Math.random();
          if (roll < 0.4) {
            marketPhaseRef.value = "capitulation";
            phaseTimer = 0;
            addEvent("💥 CRASH! PANIC SELLING!");
          } else if (roll < 0.7) {
            marketPhaseRef.value = "decline";
            phaseTimer = 0;
            addEvent("📉 Bear market begins...");
          }
        }
        break;

      case "decline":
        // Slow bleed down - the painful part
        priceChange += -0.005 + (Math.random() - 0.55) * 0.03;
        // Long decline, eventually bottoms out
        if (phaseTimer > 80 + Math.random() * 120) {
          marketPhaseRef.value = "accumulation";
          phaseTimer = 0;
          addEvent("🔄 Market finding bottom...");
        }
        // Can have capitulation events during decline
        if (Math.random() < 0.02) {
          marketPhaseRef.value = "capitulation";
          phaseTimer = 0;
          addEvent("💥 FLASH CRASH!");
        }
        break;

      case "capitulation":
        // HARD crash - mirrors euphoria but down
        priceChange += -0.04 - Math.random() * 0.1; // -4% to -14% per tick!
        // Capitulation is short, leads to slow recovery
        if (phaseTimer > 10 + Math.random() * 20) {
          marketPhaseRef.value = "accumulation";
          phaseTimer = 0;
          addEvent("😰 Blood in the streets... time to accumulate?");
        }
        break;
    }

    // Apply random noise
    priceChange += (Math.random() - 0.5) * 0.01;

    // Apply change
    btcPrice.value *= 1 + priceChange;

    // Rising floor based on progress - ensures eventual recovery and long term growth
    // Floor rises slowly, giving "slow grind back up" after crashes
    const floorPrice =
      50 + totalMinedEver.value * 0.005 + gameTime.value * 0.0005;
    btcPrice.value = Math.max(floorPrice, btcPrice.value);

    // Soft ceiling to prevent complete runaway
    if (btcPrice.value > 1000000) {
      btcPrice.value *= 0.995;
    }

    // Calculate actual percentage change after all adjustments
    marketTrend.value = ((btcPrice.value - oldPrice) / oldPrice) * 100;
  };

  const gameLoop = () => {
    gameTime.value += 1;
    stats.value.playTime += 0.1;

    if (globalBitcoinMined.value >= MAX_BITCOIN) {
      hashRate.value = totalHashPower.value;
      electricityDrain.value = totalElectricityCost.value;
      return;
    }

    let generation = miningRate.value;

    if (poolMining.value) {
      generation *= 1 - poolFee.value;
    }

    if (
      upgrades.value.find((u: Upgrade) => u.id === "lucky-mining")?.purchased &&
      Math.random() < 0.0005
    ) {
      generation *= 2;
      addEvent("🍀 Lucky block found!");
    }

    if (upgrades.value.find((u: Upgrade) => u.id === "hodl-vault")?.purchased) {
      bitcoin.value *= 1.000001;
    }

    // Electricity cost in USD per tick (game runs at 10 ticks/sec)
    const powerCostUSD = totalElectricityCost.value / 10;

    const maxCanMine = MAX_BITCOIN - globalBitcoinMined.value;
    generation = Math.min(generation, maxCanMine);

    // Always mine, but electricity cost accumulates (can go into debt)
    bitcoin.value += generation;
    totalMinedEver.value += generation;
    globalBitcoinMined.value += generation;
    stats.value.totalBTCEarned += generation;

    // Deduct electricity cost (can go negative!)
    usdBalance.value -= powerCostUSD;

    // Track principal debt (without interest) for debugging
    if (usdBalance.value < 0) {
      principalDebt.value += powerCostUSD;
    } else {
      principalDebt.value = 0; // Reset when out of debt
    }

    // Apply interest on debt (every second = every 10 ticks)
    if (usdBalance.value < 0 && gameTime.value % 10 === 0) {
      const debt = Math.abs(usdBalance.value);
      // Interest rate scales with debt: 3% base + extra for larger debts
      let interestRate = 0.03; // 3% base
      if (debt > 1000) interestRate += 0.02; // +2% if over $1K
      if (debt > 10000) interestRate += 0.03; // +3% if over $10K
      if (debt > 100000) interestRate += 0.05; // +5% if over $100K
      if (debt > 1000000) interestRate += 0.1; // +10% if over $1M
      if (debt > 10000000) interestRate += 0.15; // +15% if over $10M

      // Apply interest per second (divide by 100 to make it per-second rate)
      const interest = debt * (interestRate / 100);
      usdBalance.value -= interest;
    }

    // Warn player when in debt
    if (usdBalance.value < -100 && gameTime.value % 100 === 0) {
      const debt = Math.abs(usdBalance.value);
      let interestRate = 3;
      if (debt > 1000) interestRate += 2;
      if (debt > 10000) interestRate += 3;
      if (debt > 100000) interestRate += 5;
      if (debt > 1000000) interestRate += 10;
      if (debt > 10000000) interestRate += 15;
      addEvent(
        `🔴 DEBT: $${debt.toFixed(0)} @ ${interestRate}% interest! Sell BTC!`
      );
    }

    blocksMined.value += generation / effectiveBlockReward.value;

    if (stats.value.peakBTC < bitcoin.value) {
      stats.value.peakBTC = bitcoin.value;
    }

    hashRate.value = totalHashPower.value;
    electricityDrain.value = totalElectricityCost.value;

    if (activeResearch.value) {
      const res = research.value.find(
        (r: Research) => r.id === activeResearch.value
      );
      if (res) {
        res.progress += 1;
        if (res.progress >= res.researchTime) {
          res.completed = true;
          activeResearch.value = null;
          addEvent(`✅ Research complete: ${res.name}`);
        }
      }
    }

    if (gameTime.value % 10 === 0) {
      updateDifficulty();
      checkHalving();
      triggerRandomEvent();
      checkAchievements();
    }

    // Market updates every 2 seconds
    if (gameTime.value % 20 === 0) {
      updateMarket();
    }

    if (activeEvent.value && eventTimer.value > 0) {
      eventTimer.value--;
      if (eventTimer.value <= 0) {
        if (activeEvent.value.endEffect) {
          activeEvent.value.endEffect();
        }
        addEvent(`Event ended: ${activeEvent.value.name}`);
        activeEvent.value = null;
      }
    }
  };

  // ==================== SAVE/LOAD ====================
  const getGameStateForSave = () => {
    return {
      bitcoin: bitcoin.value,
      totalMinedEver: totalMinedEver.value,
      globalBitcoinMined: globalBitcoinMined.value,
      hashRate: hashRate.value,
      electricityDrain: electricityDrain.value,
      gameTime: gameTime.value,
      prestigeLevel: prestigeLevel.value,
      prestigePoints: prestigePoints.value,
      btcPrice: btcPrice.value,
      usdBalance: usdBalance.value,
      difficulty: difficulty.value,
      blocksMined: blocksMined.value,
      currentBlockReward: currentBlockReward.value,
      halvingCount: halvingCount.value,
      stats: { ...stats.value },
      poolMining: poolMining.value,
      rigs: rigs.value.map((r) => ({ id: r.id, count: r.count })),
      upgrades: upgrades.value.map((u) => ({
        id: u.id,
        purchased: u.purchased,
      })),
      research: research.value.map((r) => ({
        id: r.id,
        progress: r.progress,
        completed: r.completed,
      })),
      achievements: achievements.value.map((a) => ({
        id: a.id,
        unlocked: a.unlocked,
      })),
    };
  };

  const loadGameState = (
    savedState: ReturnType<typeof getGameStateForSave>
  ) => {
    bitcoin.value = savedState.bitcoin;
    totalMinedEver.value = savedState.totalMinedEver;
    globalBitcoinMined.value = savedState.globalBitcoinMined;
    hashRate.value = savedState.hashRate;
    electricityDrain.value = savedState.electricityDrain;
    gameTime.value = savedState.gameTime;
    prestigeLevel.value = savedState.prestigeLevel;
    prestigePoints.value = savedState.prestigePoints;
    btcPrice.value = savedState.btcPrice;
    usdBalance.value = savedState.usdBalance;
    difficulty.value = savedState.difficulty;
    blocksMined.value = savedState.blocksMined;
    currentBlockReward.value = savedState.currentBlockReward;
    halvingCount.value = savedState.halvingCount;
    stats.value = { ...savedState.stats };
    poolMining.value = savedState.poolMining;

    // Restore rigs
    savedState.rigs.forEach((savedRig) => {
      const rig = rigs.value.find((r) => r.id === savedRig.id);
      if (rig) rig.count = savedRig.count;
    });

    // Restore upgrades
    savedState.upgrades.forEach((savedUpgrade) => {
      const upgrade = upgrades.value.find((u) => u.id === savedUpgrade.id);
      if (upgrade) upgrade.purchased = savedUpgrade.purchased;
    });

    // Restore research
    savedState.research.forEach((savedResearch) => {
      const r = research.value.find((res) => res.id === savedResearch.id);
      if (r) {
        r.progress = savedResearch.progress;
        r.completed = savedResearch.completed;
      }
    });

    // Restore achievements
    savedState.achievements.forEach((savedAchievement) => {
      const achievement = achievements.value.find(
        (a) => a.id === savedAchievement.id
      );
      if (achievement) achievement.unlocked = savedAchievement.unlocked;
    });

    addEvent("💾 Game loaded successfully!");
  };

  const resetGameState = () => {
    bitcoin.value = 0;
    totalMinedEver.value = 0;
    globalBitcoinMined.value = 0;
    hashRate.value = 0;
    electricityDrain.value = 0;
    gameTime.value = 0;
    prestigeLevel.value = 0;
    prestigePoints.value = 0;
    btcPrice.value = 100;
    usdBalance.value = 50;
    difficulty.value = BASE_DIFFICULTY;
    blocksMined.value = 0;
    currentBlockReward.value = INITIAL_BLOCK_REWARD;
    halvingCount.value = 0;
    poolMining.value = false;

    stats.value = {
      totalClicks: 0,
      totalBTCEarned: 0,
      totalBTCSpent: 0,
      rigsBought: 0,
      upgradesBought: 0,
      achievementsUnlocked: 0,
      prestigeResets: 0,
      peakBTC: 0,
      playTime: 0,
    };

    // Reset rigs
    rigs.value = JSON.parse(JSON.stringify(INITIAL_RIGS));

    // Reset upgrades
    upgrades.value = JSON.parse(JSON.stringify(INITIAL_UPGRADES));

    // Reset research
    research.value = JSON.parse(JSON.stringify(INITIAL_RESEARCH));
    activeResearch.value = null;

    // Reset achievements (keep them but mark as not unlocked)
    achievements.value.forEach((a) => (a.unlocked = false));

    events.value = [];
    addEvent("🆕 Started a new game!");
    addEvent("💡 Mine BTC → Sell for USD → Buy rigs → Repeat!");
    addEvent("You start with $50 - buy your first miner!");
  };

  const initGame = () => {
    setInterval(gameLoop, 100);
    addEvent("Welcome to Bitcoin Mining Tycoon!");
    addEvent("💡 Mine BTC → Sell for USD → Buy rigs → Repeat!");
    addEvent("You start with $50 - buy your first miner!");

    // Debug/Cheat commands
    (window as any).cheat = {
      setBTC: (amount: number) => {
        bitcoin.value = amount;
        addEvent(`[CHEAT] Set BTC to ${amount}`);
      },
      addBTC: (amount: number) => {
        bitcoin.value += amount;
        addEvent(`[CHEAT] Added ${amount} BTC`);
      },
      setTotalMined: (amount: number) => {
        totalMinedEver.value = amount;
      },
      setUSD: (amount: number) => {
        usdBalance.value = amount;
        addEvent(`[CHEAT] Set USD to $${amount}`);
      },
      addUSD: (amount: number) => {
        usdBalance.value += amount;
        addEvent(`[CHEAT] Added $${amount}`);
      },
      unlockAll: () => {
        upgrades.value.forEach((u) => (u.purchased = true));
        addEvent("[CHEAT] All upgrades unlocked!");
      },
      maxRigs: () => {
        rigs.value.forEach((r) => (r.count = 100));
        addEvent("[CHEAT] 100 of each rig!");
      },
      triggerEvent: (index: number) => {
        if (possibleEvents[index]) {
          activeEvent.value = possibleEvents[index];
          eventTimer.value = possibleEvents[index].duration;
          possibleEvents[index].effect();
          addEvent(`[CHEAT] Triggered: ${possibleEvents[index].name}`);
        }
      },
      help: () => {
        console.log(`
Available cheats:
  cheat.setBTC(1000)      - Set BTC to exact amount
  cheat.addBTC(500)       - Add BTC to current balance
  cheat.setUSD(1000)      - Set USD to exact amount
  cheat.addUSD(500)       - Add USD to current balance
  cheat.setTotalMined(n)  - Set total mined (for unlocks)
  cheat.unlockAll()       - Unlock all upgrades
  cheat.maxRigs()         - Get 100 of each rig
  cheat.triggerEvent(0-9) - Trigger a random event
        `);
      },
    };
    console.log("🎮 Cheats available! Type cheat.help() for commands");
  };

  return {
    // State
    bitcoin,
    totalMinedEver,
    globalBitcoinMined,
    hashRate,
    electricityDrain,
    events,
    gameTime,
    prestigeLevel,
    prestigePoints,
    activeTab,
    btcPrice,
    marketTrend,
    usdBalance,
    difficulty,
    blocksMined,
    currentBlockReward,
    halvingCount,
    activeEvent,
    eventTimer,
    stats,
    poolMining,
    rigs,
    upgrades,
    research,
    activeResearch,
    achievements,
    achievementNotification,

    // Computed
    effectiveDifficulty,
    effectiveBlockReward,
    totalHashPower,
    totalElectricityCost,
    effectiveClickPower,
    miningRate,
    netProfit,
    electricityCostPerSecond,
    netProfitUSD,
    marketPrediction,
    progressToHalving,
    progressToCap,
    availableRigs,
    lockedRigsCount,
    nextLockedRig,
    availableUpgrades,
    upcomingUpgrades,
    hasMoreUpgrades,
    availableResearch,
    prestigePointsOnReset,

    // Actions
    getRigCost,
    mineClick,
    sellBTC,
    sellAllBTC,
    buyRig,
    buyUpgrade,
    startResearch,
    togglePool,
    prestige,
    addEvent,
    initGame,

    // Save/Load
    getGameStateForSave,
    loadGameState,
    resetGameState,

    // Constants
    MAX_BITCOIN,
    INITIAL_BLOCK_REWARD,
  };
}

export function useGameState() {
  if (!gameStateInstance) {
    gameStateInstance = createGameState();
  }
  return gameStateInstance;
}
