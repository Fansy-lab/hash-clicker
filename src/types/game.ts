// ==================== GAME INTERFACES ====================

export interface Rig {
  id: string;
  name: string;
  baseCost: number;
  hashPower: number;
  electricityCost: number;
  count: number;
  unlockAt: number;
  tier: number;
  description: string;
}

export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: string;
  purchased: boolean;
  category: "efficiency" | "power" | "special" | "prestige";
  unlockAt: number;
  multiplier?: number;
  requirement?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward: number;
  check: () => boolean;
}

export interface Research {
  id: string;
  name: string;
  cost: number;
  researchTime: number;
  progress: number;
  completed: boolean;
  effect: string;
  unlockAt: number;
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  effectDescription: string; // Explains the mechanical effect
  duration: number;
  effect: () => void;
  endEffect?: () => void;
}

export interface GameStats {
  totalClicks: number;
  totalBTCEarned: number;
  totalBTCSpent: number;
  rigsBought: number;
  upgradesBought: number;
  achievementsUnlocked: number;
  prestigeResets: number;
  peakBTC: number;
  playTime: number;
}

export interface EventMultiplierBackup {
  global: number;
  click: number;
  passive: number;
  electricity: number;
  difficulty: number;
  btcPrice: number;
}

export interface AchievementNotification {
  name: string;
  reward: number;
}

export interface NewsEvent {
  id: string;
  year: number;
  month: number;
  headline: string;
  description: string;
  emoji: string;
  minedPercent: number; // When this event triggers (% of 21M mined)
  isFuture?: boolean; // For fictional future events
}

// ==================== CONSTANTS ====================
export const MAX_BITCOIN = 21_000_000;
export const BASE_DIFFICULTY = 1;
export const DIFFICULTY_INCREASE_RATE = 0.00001;
export const HALVING_INTERVAL = 210000;
export const INITIAL_BLOCK_REWARD = 50;
