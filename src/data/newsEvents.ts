import type { NewsEvent } from "@/types/game";

// Bitcoin mining timeline (approximate):
// 2009 (0%): Genesis block
// 2012 (50%): First halving
// 2016 (75%): Second halving
// 2020 (87.5%): Third halving
// 2024 (93.75%): Fourth halving
// 2028 (96.875%): Fifth halving
// 2032 (98.4%): Sixth halving
// 2140 (100%): Last BTC mined

export const NEWS_EVENTS: NewsEvent[] = [
  // ==================== 2009 - THE BEGINNING ====================
  {
    id: "genesis",
    year: 2009,
    month: 1,
    headline: "Mysterious 'Satoshi Nakamoto' Creates Bitcoin",
    description:
      "A pseudonymous developer releases Bitcoin whitepaper and mines the genesis block.",
    emoji: "🌅",
    minedPercent: 0,
  },
  {
    id: "first-transaction",
    year: 2009,
    month: 1,
    headline: "First Bitcoin Transaction Recorded",
    description:
      "Satoshi sends 10 BTC to Hal Finney in the first-ever Bitcoin transaction.",
    emoji: "📨",
    minedPercent: 0.001,
  },

  // ==================== 2010 ====================
  {
    id: "pizza-day",
    year: 2010,
    month: 5,
    headline: "10,000 BTC Spent on Two Pizzas!",
    description:
      "Laszlo Hanyecz makes first real-world Bitcoin purchase. Pizza Day is born!",
    emoji: "🍕",
    minedPercent: 2,
  },
  {
    id: "first-exchange",
    year: 2010,
    month: 7,
    headline: "Mt. Gox Exchange Launches",
    description:
      "Japanese exchange Mt. Gox begins trading Bitcoin, becoming the largest exchange.",
    emoji: "🏦",
    minedPercent: 3,
  },
  {
    id: "btc-1-dollar",
    year: 2011,
    month: 2,
    headline: "Bitcoin Reaches $1 Parity with USD!",
    description:
      "For the first time, 1 BTC = $1 USD. Critics call it a bubble.",
    emoji: "💵",
    minedPercent: 8,
  },

  // ==================== 2011-2012 ====================
  {
    id: "silk-road",
    year: 2011,
    month: 6,
    headline: "Silk Road Marketplace Gains Notoriety",
    description:
      "Underground marketplace accepts only Bitcoin, drawing regulatory attention.",
    emoji: "🕵️",
    minedPercent: 12,
  },
  {
    id: "first-bubble",
    year: 2011,
    month: 6,
    headline: "Bitcoin Crashes 94% After $31 Peak!",
    description: "First major bubble pops. 'Bitcoin is dead' declares media.",
    emoji: "📉",
    minedPercent: 15,
  },
  {
    id: "halving-1",
    year: 2012,
    month: 11,
    headline: "⚡ FIRST HALVING: Block Reward Now 25 BTC",
    description:
      "Bitcoin's first halving reduces miner rewards. Supply shock begins.",
    emoji: "⚡",
    minedPercent: 50,
  },

  // ==================== 2013-2014 ====================
  {
    id: "cyprus-crisis",
    year: 2013,
    month: 3,
    headline: "Cyprus Banking Crisis Boosts Bitcoin",
    description:
      "Citizens flee to Bitcoin as banks freeze accounts. Price surges.",
    emoji: "🏃",
    minedPercent: 52,
  },
  {
    id: "btc-1000",
    year: 2013,
    month: 11,
    headline: "Bitcoin Breaks $1,000 for First Time!",
    description:
      "Massive rally driven by Chinese demand. 'Digital gold' narrative spreads.",
    emoji: "🚀",
    minedPercent: 54,
  },
  {
    id: "mtgox-hack",
    year: 2014,
    month: 2,
    headline: "Mt. Gox HACKED - 850,000 BTC STOLEN!",
    description:
      "Largest Bitcoin exchange collapses. $450M in customer funds gone.",
    emoji: "💀",
    minedPercent: 56,
  },
  {
    id: "silk-road-bust",
    year: 2014,
    month: 10,
    headline: "FBI Seizes Silk Road, Arrests Founder",
    description: "Ross Ulbricht arrested. Government auctions seized Bitcoin.",
    emoji: "👮",
    minedPercent: 58,
  },

  // ==================== 2015-2016 ====================
  {
    id: "bear-bottom",
    year: 2015,
    month: 1,
    headline: "Bitcoin Touches $150 - 'Crypto Winter' Declared",
    description:
      "18-month bear market. Mainstream media declares Bitcoin dead (again).",
    emoji: "❄️",
    minedPercent: 62,
  },
  {
    id: "ethereum-launch",
    year: 2015,
    month: 7,
    headline: "Ethereum Launches - 'World Computer' Born",
    description:
      "Vitalik Buterin's smart contract platform goes live. Alt season begins.",
    emoji: "💎",
    minedPercent: 65,
  },
  {
    id: "halving-2",
    year: 2016,
    month: 7,
    headline: "⚡ SECOND HALVING: Block Reward Now 12.5 BTC",
    description: "Second halving complete. Analysts predict massive bull run.",
    emoji: "⚡",
    minedPercent: 75,
  },
  {
    id: "bitfinex-hack",
    year: 2016,
    month: 8,
    headline: "Bitfinex Hacked - 120,000 BTC Stolen",
    description: "Another major exchange breach. Security concerns rise.",
    emoji: "🔓",
    minedPercent: 76,
  },

  // ==================== 2017 - THE BULL RUN ====================
  {
    id: "btc-10000",
    year: 2017,
    month: 11,
    headline: "Bitcoin Smashes Through $10,000!",
    description: "Parabolic rally accelerates. FOMO reaches fever pitch.",
    emoji: "📈",
    minedPercent: 79,
  },
  {
    id: "cme-futures",
    year: 2017,
    month: 12,
    headline: "CME Launches Bitcoin Futures",
    description: "Wall Street enters crypto. Institutional era begins.",
    emoji: "🏛️",
    minedPercent: 80,
  },
  {
    id: "btc-20000",
    year: 2017,
    month: 12,
    headline: "BITCOIN HITS $20,000 - ALL TIME HIGH!",
    description: "Mania peaks. Your Uber driver is giving crypto advice.",
    emoji: "🎉",
    minedPercent: 80.5,
  },

  // ==================== 2018-2019 ====================
  {
    id: "2018-crash",
    year: 2018,
    month: 1,
    headline: "Crypto Crash: Bitcoin Drops 65% in One Month",
    description:
      "Post-mania hangover. 'I told you so' from every financial pundit.",
    emoji: "💥",
    minedPercent: 81,
  },
  {
    id: "crypto-winter-2",
    year: 2018,
    month: 12,
    headline: "Bitcoin at $3,200 - 84% Down From Peak",
    description: "Year-long bear market. Mining farms shut down globally.",
    emoji: "🥶",
    minedPercent: 83,
  },
  {
    id: "facebook-libra",
    year: 2019,
    month: 6,
    headline: "Facebook Announces Libra Cryptocurrency",
    description: "Big Tech enters crypto. Regulators immediately oppose it.",
    emoji: "📱",
    minedPercent: 85,
  },

  // ==================== 2020 ====================
  {
    id: "covid-crash",
    year: 2020,
    month: 3,
    headline: "COVID Crash: Bitcoin Drops 50% in 24 Hours!",
    description: "Black Thursday. BTC hits $3,800 as markets panic.",
    emoji: "🦠",
    minedPercent: 86.5,
  },
  {
    id: "halving-3",
    year: 2020,
    month: 5,
    headline: "⚡ THIRD HALVING: Block Reward Now 6.25 BTC",
    description:
      "Third halving during pandemic. Stock-to-flow model gains traction.",
    emoji: "⚡",
    minedPercent: 87.5,
  },
  {
    id: "microstrategy",
    year: 2020,
    month: 8,
    headline: "MicroStrategy Buys $250M in Bitcoin",
    description:
      "First public company puts Bitcoin on balance sheet. Saylor becomes icon.",
    emoji: "🏢",
    minedPercent: 88,
  },
  {
    id: "paypal-btc",
    year: 2020,
    month: 10,
    headline: "PayPal Enables Bitcoin Purchases!",
    description:
      "346 million PayPal users can now buy crypto. Mass adoption accelerates.",
    emoji: "💳",
    minedPercent: 88.5,
  },

  // ==================== 2021 ====================
  {
    id: "tesla-btc",
    year: 2021,
    month: 2,
    headline: "Tesla Buys $1.5 BILLION in Bitcoin!",
    description: "Elon Musk sends market into frenzy. BTC breaks $50k.",
    emoji: "🚗",
    minedPercent: 89,
  },
  {
    id: "coinbase-ipo",
    year: 2021,
    month: 4,
    headline: "Coinbase IPO Values Exchange at $86 Billion",
    description:
      "First major crypto company goes public. Legitimacy milestone.",
    emoji: "📊",
    minedPercent: 89.5,
  },
  {
    id: "el-salvador",
    year: 2021,
    month: 6,
    headline: "El Salvador Makes Bitcoin LEGAL TENDER!",
    description:
      "First nation adopts BTC as official currency. Historic moment.",
    emoji: "🇸🇻",
    minedPercent: 90,
  },
  {
    id: "china-ban",
    year: 2021,
    month: 9,
    headline: "China Bans ALL Crypto Transactions",
    description:
      "Massive mining exodus. Hash rate drops 50%, then recovers elsewhere.",
    emoji: "🇨🇳",
    minedPercent: 90.5,
  },
  {
    id: "btc-69000",
    year: 2021,
    month: 11,
    headline: "BITCOIN HITS $69,000 - NEW ALL TIME HIGH!",
    description: "Nice. The number everyone will remember forever.",
    emoji: "🔥",
    minedPercent: 91,
  },

  // ==================== 2022 ====================
  {
    id: "luna-crash",
    year: 2022,
    month: 5,
    headline: "LUNA/UST Collapse Wipes Out $60 BILLION",
    description: "Algorithmic stablecoin death spiral. Contagion spreads.",
    emoji: "🌙",
    minedPercent: 91.5,
  },
  {
    id: "celsius-bankrupt",
    year: 2022,
    month: 6,
    headline: "Celsius Freezes Withdrawals, Files Bankruptcy",
    description:
      "Crypto lender implodes. 'Not your keys, not your coins' proven again.",
    emoji: "🧊",
    minedPercent: 92,
  },
  {
    id: "ftx-collapse",
    year: 2022,
    month: 11,
    headline: "FTX IMPLODES - SBF Arrested for Fraud!",
    description: "$32B exchange gone in days. Biggest fraud in crypto history.",
    emoji: "🔥",
    minedPercent: 92.5,
  },

  // ==================== 2023 ====================
  {
    id: "btc-16000",
    year: 2023,
    month: 1,
    headline: "Bitcoin Recovers to $23,000 After FTX Bottom",
    description: "Crypto winter may be thawing. Survivors rebuilding.",
    emoji: "🌱",
    minedPercent: 93,
  },
  {
    id: "blackrock-etf",
    year: 2023,
    month: 6,
    headline: "BlackRock Files for Spot Bitcoin ETF!",
    description:
      "World's largest asset manager wants in. Game changer pending.",
    emoji: "🏦",
    minedPercent: 93.3,
  },
  {
    id: "binance-sec",
    year: 2023,
    month: 11,
    headline: "Binance CEO CZ Pleads Guilty, Steps Down",
    description: "$4.3B settlement with DOJ. End of an era.",
    emoji: "⚖️",
    minedPercent: 93.5,
  },

  // ==================== 2024 ====================
  {
    id: "etf-approved",
    year: 2024,
    month: 1,
    headline: "🎉 SPOT BITCOIN ETF APPROVED!",
    description:
      "SEC finally approves 11 spot Bitcoin ETFs. Wall Street flood gates open.",
    emoji: "✅",
    minedPercent: 93.6,
  },
  {
    id: "halving-4",
    year: 2024,
    month: 4,
    headline: "⚡ FOURTH HALVING: Block Reward Now 3.125 BTC",
    description: "Fourth halving with ETF demand. Supply squeeze intensifies.",
    emoji: "⚡",
    minedPercent: 93.75,
  },
  {
    id: "btc-100000",
    year: 2024,
    month: 12,
    headline: "BITCOIN BREAKS $100,000!!!",
    description: "Six figures achieved. Your parents finally ask about crypto.",
    emoji: "💯",
    minedPercent: 94,
  },

  // ==================== FUTURE EVENTS (95%+) ====================
  {
    id: "future-sovereign-funds",
    year: 2025,
    month: 3,
    headline: "Sovereign Wealth Funds Begin Bitcoin Allocation",
    description: "Norway's fund adds 2% BTC. Other nations follow.",
    emoji: "🌍",
    minedPercent: 95,
    isFuture: true,
  },
  {
    id: "future-btc-250k",
    year: 2025,
    month: 8,
    headline: "Bitcoin Surges Past $250,000",
    description: "ETF inflows + halving supply shock creates perfect storm.",
    emoji: "🌊",
    minedPercent: 95.5,
    isFuture: true,
  },
  {
    id: "future-us-reserve",
    year: 2026,
    month: 2,
    headline: "US Strategic Bitcoin Reserve Announced!",
    description: "Treasury begins accumulating BTC. Dollar confidence shaken.",
    emoji: "🇺🇸",
    minedPercent: 96,
    isFuture: true,
  },
  {
    id: "future-btc-500k",
    year: 2026,
    month: 11,
    headline: "Bitcoin Hits $500,000 - Passes Gold Market Cap!",
    description: "'Digital gold' narrative becomes literal reality.",
    emoji: "👑",
    minedPercent: 96.5,
    isFuture: true,
  },
  {
    id: "halving-5",
    year: 2028,
    month: 4,
    headline: "⚡ FIFTH HALVING: Block Reward Now 1.5625 BTC",
    description: "Mining rewards shrink further. Fee market dominates.",
    emoji: "⚡",
    minedPercent: 96.875,
    isFuture: true,
  },
  {
    id: "future-btc-1m",
    year: 2029,
    month: 6,
    headline: "BITCOIN REACHES $1,000,000!",
    description: "Seven figures. The Citadels begin construction.",
    emoji: "🏰",
    minedPercent: 97.5,
    isFuture: true,
  },
  {
    id: "future-central-banks",
    year: 2030,
    month: 3,
    headline: "Central Banks Hold 5% Reserves in Bitcoin",
    description: "IMF updates reserve requirements. BTC becomes tier-1 asset.",
    emoji: "🏛️",
    minedPercent: 97.8,
    isFuture: true,
  },
  {
    id: "halving-6",
    year: 2032,
    month: 4,
    headline: "⚡ SIXTH HALVING: Block Reward Now 0.78125 BTC",
    description: "Sub-1 BTC rewards. Transaction fees exceed block rewards.",
    emoji: "⚡",
    minedPercent: 98.4,
    isFuture: true,
  },
  {
    id: "future-quantum",
    year: 2033,
    month: 9,
    headline: "Bitcoin Survives Quantum Computing Threat",
    description: "Taproot upgrade to quantum-resistant signatures successful.",
    emoji: "🔐",
    minedPercent: 98.6,
    isFuture: true,
  },
  {
    id: "future-mars",
    year: 2035,
    month: 7,
    headline: "First Bitcoin Transaction from Mars!",
    description:
      "SpaceX colony mines first off-world block. 22-minute confirmation.",
    emoji: "🚀",
    minedPercent: 99,
    isFuture: true,
  },
  {
    id: "halving-7",
    year: 2036,
    month: 4,
    headline: "⚡ SEVENTH HALVING: Block Reward Now 0.390625 BTC",
    description: "Mining increasingly relies on fee revenue.",
    emoji: "⚡",
    minedPercent: 99.2,
    isFuture: true,
  },
  {
    id: "future-world-currency",
    year: 2040,
    month: 1,
    headline: "Bitcoin Becomes World Reserve Currency",
    description: "UN adopts BTC as global settlement layer. Fiat era ends.",
    emoji: "🌐",
    minedPercent: 99.5,
    isFuture: true,
  },
  {
    id: "future-satoshi-reveal",
    year: 2045,
    month: 10,
    headline: "Satoshi Nakamoto's Identity Finally Revealed",
    description: "Documents unsealed after 50 years. The world is shocked.",
    emoji: "👤",
    minedPercent: 99.7,
    isFuture: true,
  },
  {
    id: "future-last-btc",
    year: 2140,
    month: 1,
    headline: "THE FINAL BITCOIN IS MINED",
    description: "21 million complete. The great experiment succeeds.",
    emoji: "🏆",
    minedPercent: 99.99,
    isFuture: true,
  },
];

// Helper to get current year based on mined percentage
export function getYearFromMinedPercent(percent: number): {
  year: number;
  month: number;
} {
  // Rough mapping based on halving schedule
  if (percent <= 0) return { year: 2009, month: 1 };
  if (percent <= 50) {
    // 2009-2012: 0% to 50%
    const progress = percent / 50;
    const months = Math.floor(progress * 46); // ~46 months from Jan 2009 to Nov 2012
    return {
      year: 2009 + Math.floor(months / 12),
      month: 1 + (months % 12),
    };
  }
  if (percent <= 75) {
    // 2012-2016: 50% to 75%
    const progress = (percent - 50) / 25;
    const months = Math.floor(progress * 44); // ~44 months
    return {
      year: 2012 + Math.floor(months / 12),
      month: 11 + (months % 12),
    };
  }
  if (percent <= 87.5) {
    // 2016-2020: 75% to 87.5%
    const progress = (percent - 75) / 12.5;
    const months = Math.floor(progress * 46); // ~46 months
    return {
      year: 2016 + Math.floor(months / 12),
      month: 7 + (months % 12),
    };
  }
  if (percent <= 93.75) {
    // 2020-2024: 87.5% to 93.75%
    const progress = (percent - 87.5) / 6.25;
    const months = Math.floor(progress * 47); // ~47 months
    return {
      year: 2020 + Math.floor(months / 12),
      month: 5 + (months % 12),
    };
  }
  if (percent <= 96.875) {
    // 2024-2028: 93.75% to 96.875%
    const progress = (percent - 93.75) / 3.125;
    const months = Math.floor(progress * 48);
    return {
      year: 2024 + Math.floor(months / 12),
      month: 4 + (months % 12),
    };
  }
  if (percent <= 98.4375) {
    // 2028-2032
    const progress = (percent - 96.875) / 1.5625;
    const months = Math.floor(progress * 48);
    return {
      year: 2028 + Math.floor(months / 12),
      month: 4 + (months % 12),
    };
  }
  if (percent <= 99.9) {
    // 2032-2140 (compressed for gameplay)
    const progress = (percent - 98.4375) / 1.5;
    const years = Math.floor(progress * 108); // Speed up time
    return {
      year: 2032 + years,
      month: 1 + Math.floor(Math.random() * 12),
    };
  }
  return { year: 2140, month: 1 };
}

export function getMonthName(month: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[(((month - 1) % 12) + 12) % 12];
}
