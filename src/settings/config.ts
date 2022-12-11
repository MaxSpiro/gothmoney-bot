export const config = {
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY || "",
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET || "",
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || "",
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
  GENIUS_API_KEY: process.env.GENIUS_API_KEY || "",
  REDIS_URL: process.env.REDIS_URL || "",
};

export const CACHE_INTERVAL = 60 * 60 * 24 * 1000; // 7 days
